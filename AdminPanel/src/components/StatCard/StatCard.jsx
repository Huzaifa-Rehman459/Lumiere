import "./StatCard.css";
export default function StatCard({ Icon, label, value, trend }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">
        <Icon size={19} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {trend && (
          <em>
            ↗ {trend} <i>vs. last week</i>
          </em>
        )}
      </div>
    </div>
  );
}
