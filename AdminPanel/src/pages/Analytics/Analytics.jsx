import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import StatCard from "../../components/StatCard/StatCard";
import DataTable from "../../components/DataTable/DataTable";
import { Package, ClipboardList, Users, DollarSign } from "lucide-react";
import { money, downloadCSV } from "../../utils/adminHelpers";
import "./Analytics.css";
export default function Analytics() {
  const { data } = useAdmin();
  const revenue = data.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const states = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  return (
    <PageContent
      title="Analytics"
      description="A quick look at your store's current performance."
    >
      <div className="analytics-stats">
        {[
          [DollarSign, "Revenue", money(revenue)],
          [ClipboardList, "Orders", data.orders.length],
          [Package, "Products", data.products.length],
          [Users, "Customers", data.customers.length],
        ].map(([Icon, label, value]) => (
          <StatCard key={label} Icon={Icon} label={label} value={value} />
        ))}
      </div>
      <Panel>
        <h2>Order Status Breakdown</h2>
        {states.map((s) => {
          const count = data.orders.filter((o) => o.status === s).length;
          return (
            <div className="analytics-line" key={s}>
              <span>{s}</span>
              <div>
                <i
                  style={{
                    width:
                      (data.orders.length
                        ? (count / data.orders.length) * 100
                        : 0) + "%",
                  }}
                />
              </div>
              <b>{count}</b>
            </div>
          );
        })}
        <button
          className="btn btn-light"
          onClick={() => downloadCSV("orders", data.orders)}
        >
          Export orders CSV
        </button>
      </Panel>
    </PageContent>
  );
}
