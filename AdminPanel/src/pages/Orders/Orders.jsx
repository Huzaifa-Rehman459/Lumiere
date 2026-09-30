import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { apiRequest } from "../../api/client";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import OrderModal from "../../components/OrderModal/OrderModal";
import { downloadCSV, money } from "../../utils/adminHelpers";
import "./Orders.css";

const STATUSES = ["processing", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 10;
const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const itemCount = (order) => order.items.reduce((sum, i) => sum + i.quantity, 0);
const customerName = (o) => o.user?.fullName ?? o.shippingAddress.fullName;

export default function Orders() {
  const { notify } = useAdmin();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [viewing, setViewing] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest("/orders/all");
      setOrders(data.orders);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function changeStatus(order, status) {
    if (status === order.status) return;

    if (
      status === "cancelled" &&
      !window.confirm(
        `Cancel order ${order.orderNumber}?\n\nThis can't be undone, and the items will be returned to stock.`,
      )
    ) {
      return;
    }

    setUpdatingId(order._id);
    try {
      const res = await apiRequest(`/orders/${order._id}/status`, {
        method: "PUT",
        body: { status },
      });
      setOrders((list) =>
        list.map((o) =>
          o._id === order._id ? { ...o, status: res.order.status } : o,
        ),
      );
      notify(`Order ${order.orderNumber} marked ${status}`);
    } catch (err) {
      notify(err.message, "error");
      if (err.status === 409) load();
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = useMemo(() => {
    const c = { all: orders.length };
    orders.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1;
    });
    return c;
  }, [orders]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (tab !== "all" && o.status !== tab) return false;
        if (!q) return true;
        const haystack = [
          o.orderNumber,
          o.user?.fullName,
          o.user?.email,
          o.shippingAddress?.fullName,
          o.shippingAddress?.phone,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }),
    [orders, tab, q],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const rows = visible.map((o) => ({
    key: o._id,
    cells: [
      <b>{o.orderNumber}</b>,
      <div>
        <div>{customerName(o)}</div>
        <small className="order-sub">{o.user?.email ?? ""}</small>
      </div>,
      new Date(o.createdAt).toLocaleDateString(),
      itemCount(o),
      money(o.total),
      o.status === "cancelled" ? (
        <StatusBadge status="Cancelled" />
      ) : (
        <select
          className="order-status"
          value={o.status}
          disabled={updatingId === o._id}
          onChange={(e) => changeStatus(o, e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      ),
      <div className="row-actions">
        <button title="View details" onClick={() => setViewing(o)}>
          <Eye size={14} />
        </button>
      </div>,
    ],
  }));

  return (
    <PageContent
      title="Orders"
      description="Review purchases and keep customers informed."
    >
      <Panel>
        <Toolbar
          count={filtered.length}
          onExport={() =>
            downloadCSV(
              "orders",
              filtered.map((o) => ({
                order: o.orderNumber,
                customer: customerName(o),
                email: o.user?.email ?? "",
                date: new Date(o.createdAt).toISOString().slice(0, 10),
                items: itemCount(o),
                subtotal: o.subtotal,
                shipping: o.shipping,
                total: o.total,
                status: o.status,
                recipient: o.shippingAddress.fullName,
                phone: o.shippingAddress.phone,
                address: o.shippingAddress.addressLine,
                city: o.shippingAddress.city,
                postalCode: o.shippingAddress.postalCode,
              })),
            )
          }
        />

        <div className="status-tabs">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              className={`status-tab ${tab === s ? "status-tab-on" : ""}`}
              onClick={() => {
                setTab(s);
                setPage(1);
              }}
            >
              {s === "all" ? "All" : label(s)} <span>{counts[s] || 0}</span>
            </button>
          ))}
        </div>

        <div className="orders-filterbar">
          <div className="list-search">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search order number, name, email or phone..."
            />
          </div>
          <button className="btn btn-light" onClick={refresh} disabled={refreshing}>
            <RefreshCw size={14} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="page-status">Loading orders...</p>
        ) : loadError ? (
          <div className="page-status page-status--error">
            {loadError}
            <button className="btn btn-light" onClick={load}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <DataTable
              columns={["Order", "Customer", "Date", "Items", "Total", "Status", "Details"]}
              rows={rows}
            />
            {pages > 1 && (
              <div className="table-pager">
                <button
                  className="btn btn-light"
                  disabled={current <= 1}
                  onClick={() => setPage(current - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {current} of {pages}
                </span>
                <button
                  className="btn btn-light"
                  disabled={current >= pages}
                  onClick={() => setPage(current + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Panel>

      {viewing && <OrderModal order={viewing} onClose={() => setViewing(null)} />}
    </PageContent>
  );
}