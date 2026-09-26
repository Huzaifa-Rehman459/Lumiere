import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { downloadCSV, filterRows, money } from "../../utils/adminHelpers";
import "./Orders.css";
export default function Orders() {
  const { data, updateCollection, notify } = useAdmin();
  const [query, setQuery] = useState("");
  const items = filterRows(data.orders, query);
  const rows = items.map((o) => ({
    key: o.id,
    cells: [
      <b>{o.id}</b>,
      o.customer,
      o.date,
      o.items,
      money(o.total),
      <select
        className="order-status"
        value={o.status}
        onChange={(e) => {
          updateCollection(
            "orders",
            data.orders.map((x) =>
              x.id === o.id ? { ...x, status: e.target.value } : x,
            ),
          );
          notify("Order status updated");
        }}
      >
        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
          (s) => (
            <option key={s}>{s}</option>
          ),
        )}
      </select>,
    ],
  }));
  return (
    <PageContent
      title="Orders"
      description="Review purchases and keep customers informed."
    >
      <Panel>
        <Toolbar
          count={data.orders.length}
          onExport={() => downloadCSV("orders", data.orders)}
        />
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter orders..."
          />
        </div>
        <DataTable
          columns={["Order", "Customer", "Date", "Items", "Total", "Status"]}
          rows={rows}
        />
      </Panel>
    </PageContent>
  );
}
