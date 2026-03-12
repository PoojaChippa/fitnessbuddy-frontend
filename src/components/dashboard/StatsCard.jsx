export default function StatCard({ title, value, color }) {
  return (
    <div className="dashboard-card">
      <p className="dashboard-card-title">{title}</p>

      <p className={`dashboard-card-value ${color ?? ""}`}>{value}</p>
    </div>
  );
}
