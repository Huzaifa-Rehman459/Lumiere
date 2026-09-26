import { useNavigate } from "react-router-dom";
import { Package, ClipboardList, Users, DollarSign } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import StatCard from "../../components/StatCard/StatCard";
import DataTable from "../../components/DataTable/DataTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { money } from "../../utils/adminHelpers";
import "./Dashboard.css";
export default function Dashboard() {
  const { data } = useAdmin(),
    navigate = useNavigate();
  const revenue = data.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const stats = [
    [Package, "Total Products", data.products.length],
    [ClipboardList, "Total Orders", data.orders.length],
    [Users, "Total Customers", data.customers.length],
    [DollarSign, "Total Revenue", money(revenue)],
  ];
  return (
    <PageContent
      title="Welcome back, Admin"
      description="Here’s what’s happening with your store today."
    >
      <div className="dashboard-stats">
        {stats.map(([Icon, label, value]) => (
          <StatCard
            key={label}
            Icon={Icon}
            label={label}
            value={value}
            trend="12%"
          />
        ))}
      </div>
      <div className="dashboard-grid">
        <Panel>
          <h2>Sales Overview</h2>
          <p>Your store performance over the last 7 days.</p>
          <div className="sales-chart">
            {[38, 53, 48, 72, 66, 83, 95].map((height, i) => (
              <i style={{ height: height + "%" }} key={i} />
            ))}
          </div>
          <div className="chart-labels">
            Sep 17　 Sep 18　 Sep 19　 Sep 20　 Sep 21　 Sep 22　 Sep 23
          </div>
        </Panel>
        <Panel>
          <h2>Top Products</h2>
          <p>Popular items in your catalog.</p>
          {data.products.slice(0, 4).map((p, i) => (
            <div className="top-product" key={p.id}>
              <span>{i + 1}</span>
              <b>{p.name}</b>
              <small>{money(p.price)}</small>
            </div>
          ))}
        </Panel>
        <Panel className="dashboard-wide">
          <h2>
            Recent Orders{" "}
            <button className="text-link" onClick={() => navigate("/orders")}>
              View all →
            </button>
          </h2>
          <DataTable
            columns={["Order ID", "Customer", "Status", "Total"]}
            rows={data.orders
              .slice(0, 4)
              .map((o) => ({
                key: o.id,
                cells: [
                  o.id,
                  o.customer,
                  <StatusBadge status={o.status} />,
                  money(o.total),
                ],
              }))}
          />
        </Panel>
        <Panel>
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            {[
              ["＋", "Add Product", () => navigate("/products")],
              ["▣", "Manage Orders", () => navigate("/orders")],
              ["▦", "Manage Categories", () => navigate("/categories")],
              ["◇", "Create Coupon", () => navigate("/coupons")],
            ].map(([icon, label, fn]) => (
              <button key={label} onClick={fn}>
                {icon} {label}　›
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </PageContent>
  );
}
