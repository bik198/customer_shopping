export default function KPICard({ icon, label, value, color, isMoney }) {
  const displayValue =
    isMoney && typeof value === "number" && isFinite(value)
      ? `$${value.toLocaleString()}`
      : value ?? "--";
  return (
    <div className="bg-white rounded shadow px-6 py-4 flex items-center space-x-4 min-w-[160px]">
      {icon && <span className={`text-3xl ${color}`}>{icon}</span>}
      <div>
        <div className="text-2xl font-bold">{displayValue}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
}
