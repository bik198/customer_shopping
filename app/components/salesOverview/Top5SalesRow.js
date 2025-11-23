'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

function SimpleBar({ title, data, barColor }) {
  const chartData = Object.entries(data).map(([name, sales]) => ({
    name: name.length > 14 ? name.slice(0, 13) + '…' : name,
    sales
  }));

  // Format counts (e.g., 34,123 or 12.7K)
  const formatLabel = c =>
    c >= 10000
      ? (Math.round(c / 100) / 10).toFixed(1) + 'K'
      : c.toLocaleString();

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="text-base font-semibold mb-2 text-center">{title}</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 36, right: 8, top: 8, bottom: 8 }}
          barCategoryGap={14}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            interval={0}
            width={100}
            tick={{ fontSize: 14 }}
          />
          <Tooltip />
          <Bar dataKey="sales" fill={barColor} barSize={20}>
            <LabelList
              dataKey="sales"
              position="insideRight"
              formatter={formatLabel}
              fontSize="13"
              fill="#fff"
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Top5SalesRow({ top5 }) {
  return (
    <div className="bg-white rounded shadow p-6 w-full mb-8">
      <h2 className="text-2xl font-bold mb-5">Top 5 Sales Amount by:</h2>
      <div className="grid grid-cols-5 gap-6">
        <SimpleBar title="State" data={top5.top5_state} barColor="#6366f1" />
        <SimpleBar title="Shipping Type" data={top5.top5_shipping} barColor="#fbbf24" />
        <SimpleBar title="Item Purchased" data={top5.top5_item} barColor="#10b981" />
        <SimpleBar title="Payment Method" data={top5.top5_payment} barColor="#ec4899" />
        <SimpleBar title="Frequency" data={top5.top5_freq} barColor="#818cf8" />
      </div>
    </div>
  );
  
}
