export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h3>

      <p className="text-4xl font-semibold mt-3 text-gray-900">{value}</p>
    </div>
  );
}
