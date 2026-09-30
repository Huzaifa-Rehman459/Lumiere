import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ClipboardList,
  Grid2X2,
  DollarSign,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "../../api/client";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import StatCard from "../../components/StatCard/StatCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { money } from "../../utils/adminHelpers";
import "./Dashboard.css";

const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Dashboard() {
  const navigate = useNavigate();

  const [productTotal, setProductTotal] = useState(null);
  const [categoryTotal, setCategoryTotal] = useState(null);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      apiRequest("/products?limit=1"),
      apiRequest("/categories?all=true"),
      apiRequest("/orders/all"),
    ])
      .then(([products, categories, ordersRes]) => {
        if (cancelled) return;
        setProductTotal(products.total);
        setCategoryTotal(categories.categories.length);
        setOrders(ordersRes.orders);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loading = orders === null && !error;

  const revenue = useMemo(() => {
    if (!orders) return 0;
    return orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const topProducts = useMemo(() => {
    if (!orders) return [];
    const counts = new Map();
    for (const order of orders) {
      if (order.status === "cancelled") continue;
      for (const item of order.items) {
        const key = String(item.product ?? item.name);
        const entry = counts.get(key) ?? {
          name: item.name,
          image: item.image,
          units: 0,
          revenue: 0,
        };
        entry.units += item.quantity;
        entry.revenue += item.lineTotal;
        counts.set(key, entry);
      }
    }
    return [...counts.values()].sort((a, b) => b.units - a.units).slice(0, 4);
  }, [orders]);

  const recentOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  return (
    <PageContent title="Dashboard" description="A live snapshot of your store.">
      {error ? (
        <div className="page-status page-status--error">{error}</div>
      ) : loading ? (
        <p className="page-status">Loading dashboard...</p>
      ) : (
        <>
          <div className="dashboard-stats">
            <StatCard Icon={DollarSign} label="Revenue" value={money(revenue)} />
            <StatCard Icon={ClipboardList} label="Orders" value={orders.length} />
            <StatCard Icon={Package} label="Products" value={productTotal} />
            <StatCard Icon={Grid2X2} label="Categories" value={categoryTotal} />
          </div>

          <div className="dashboard-grid">
            <Panel title="Top Products">
              <button className="text-link" onClick={() => navigate("/products")}>
                Manage
              </button>
              {topProducts.length === 0 ? (
                <p className="page-status">No sales yet.</p>
              ) : (
                topProducts.map((p) => (
                  <div className="top-product" key={p.name}>
                    {p.image ? (
                      <img className="top-product-img" src={p.image} alt="" />
                    ) : (
                      <span>{p.name[0]}</span>
                    )}
                    <b>{p.name}</b>
                    <small>{p.units} sold</small>
                    <small>{money(p.revenue)}</small>
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Recent Orders">
              <button className="text-link" onClick={() => navigate("/orders")}>
                View all
              </button>
              {recentOrders.length === 0 ? (
                <p className="page-status">No orders yet.</p>
              ) : (
                recentOrders.map((o) => (
                  <div className="recent-order" key={o._id}>
                    <div>
                      <b>{o.orderNumber}</b>
                      <small>{o.user?.fullName ?? o.shippingAddress.fullName}</small>
                    </div>
                    <span>{money(o.total)}</span>
                    <StatusBadge status={label(o.status)} />
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Quick Actions" className="dashboard-wide">
              <div className="quick-actions">
                <button onClick={() => navigate("/products")}>
                  <Plus size={14} /> Add Product
                </button>
                <button onClick={() => navigate("/categories")}>
                  <Plus size={14} /> Add Category
                </button>
                <button onClick={() => navigate("/orders")}>
                  <ClipboardList size={14} /> Review Orders
                </button>
                <button onClick={() => navigate("/admins")}>
                  <ShieldCheck size={14} /> Manage Admins
                </button>
              </div>
            </Panel>
          </div>
        </>
      )}
    </PageContent>
  );
}