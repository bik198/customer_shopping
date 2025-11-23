'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#6366f1', '#22c55e', '#f59e42', '#f472b6', '#0ea5e9', '#fbbf24', '#38bdf8'
];

const AGE_LABEL_MAP = {
  '0-18': '0–18',
  '19-25': '19–25',
  '26-35': '26–35',
  '36-45': '36–45',
  '46-55': '46–55',
  '56-65': '56–65',
  '66+': '66+',
};

export default function AgeGroupSalesPieChart({ ageData }) {
  const data = Object.entries(ageData)
    .filter(([_, val]) => Number(val) > 0)
    .map(([key, val]) => ({
      name: AGE_LABEL_MAP[key] || key,
      value: Number(val)
    }));

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Sales by Age Group</h3>
      <ResponsiveContainer width="100%" height={330}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#6366f1"
            label={({ percent, name }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            isAnimationActive={false}
          >
            {
              data.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))
            }
          </Pie>
          <Tooltip
            formatter={(val) => val.toLocaleString('en-US')}
            labelFormatter={(name) => `${name}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
