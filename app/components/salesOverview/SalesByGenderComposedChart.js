'use client';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#f472b6']; // Male: Indigo, Female: Pink

export default function SalesByGenderPieChart({ rawData }) {
  // Only Male & Female
  const data = (() => {
    const totals = { Male: 0, Female: 0 };
    rawData.forEach(row => {
      if (row.Gender === 'Male' || row.Gender === 'Female') {
        const amt = Number(row["Purchase Amount"]) || Number(row["Purchase Amount (USD)"]) || 0;
        totals[row.Gender] += amt;
      }
    });
    return [
      { name: 'Male', value: totals.Male },
      { name: 'Female', value: totals.Female }
    ];
  })();

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Sales by Gender</h3>
      <ResponsiveContainer width="100%" height={330}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={6}
            cornerRadius={20}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
