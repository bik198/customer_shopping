'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#38bdf8', '#fbbf24']; // Blue, Yellow

export default function CustomerGenderPie({ rawData = [], filters }) {
  // Filter data using state, gender, and age
  const data = (() => {
    const totals = { Male: 0, Female: 0 };
    (rawData || []).forEach(row => {
      if (row.Gender === 'Male' || row.Gender === 'Female') {
        const age = Number(row.Age);
        const location = row.Location || "Unknown";
        // -- Correctly filter by state --
        if (filters.region && filters.region !== "All" && location !== filters.region)
          return;
        // Gender filter
        if (filters.gender !== "All" && row.Gender !== filters.gender)
          return;
        // Age filter
        if (isNaN(age) || age < filters.age[0] || age > filters.age[1])
          return;

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
    <div>
      <h3 className="font-semibold text-lg mb-4">Customer Gender Distribution</h3>
      {/* Pie chart only */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="55%"
            cy="55%"
            innerRadius={70}
            outerRadius={90}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            paddingAngle={0}
            cornerRadius={10}
            labelLine={false}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={val => val.toLocaleString()} />
        </PieChart>
      </ResponsiveContainer>
      {/* Custom legend below chart, with spacing */}
      <div className="flex justify-center mt-10">
        <div>
          <span style={{ color: COLORS[1], fontWeight: 600, marginRight: 30 }}>
            ■ Female
          </span>
          <span style={{ color: COLORS[0], fontWeight: 600 }}>
            ■ Male
          </span>
        </div>
      </div>
    </div>
  );
}
