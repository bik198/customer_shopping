'use client';
import { BarChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function CategorySalesComboChart({ categoryData }) {
  // For illustration, estimate Avg Purchase by dividing sales by 1,000 (replace with actual avg if available)
  const data = Object.entries(categoryData).map(([category, totalSales]) => ({
    category,
    totalSales,
    avgPurchase: Math.round(totalSales / 1000)
  }));

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Product Category Sales</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="totalSales" fill="#6366f1" name="Total Sales" />
          <Line yAxisId="right" type="monotone" dataKey="avgPurchase" stroke="#f59e42" name="Avg Purchase (Est)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
