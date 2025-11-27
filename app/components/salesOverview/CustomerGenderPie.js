'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#38bdf8', '#fbbf24']; // Blue, Yellow

export default function CustomerGenderPie({ rawData = [], filters }) {
  const data = (() => {
    const totals = { Male: 0, Female: 0 };
    (rawData || []).forEach((row) => {
      const gender = row.Gender;
      if (gender === 'Male' || gender === 'Female') {
        const age = Number(row.Age);
        const location = row.Location || 'Unknown';

        if (filters.region && filters.region !== 'All' && location !== filters.region) return;
        if (filters.gender !== 'All' && gender !== filters.gender) return;
        if (isNaN(age) || age < filters.age[0] || age > filters.age[1]) return;

        // count after all filters
        totals[gender] += 1;
      }
    });
    return [
      { name: 'Male', value: totals.Male },
      { name: 'Female', value: totals.Female },
    ];
  })();

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const RADIAN = Math.PI / 180;
  const renderGenderLabel = (props) => {
    const {
      cx = 0,
      cy = 0,
      midAngle = 0,
      innerRadius = 0,
      outerRadius = 0,
      name,
      percent = 0,
      value = 0,
    } = props;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={name === 'Male' ? 'end' : 'start'}
        dominantBaseline="central"
        fill="#111827"
        fontSize={14}
      >
        <tspan x={x} dy="-0.3em">
          {name}
        </tspan>
        <tspan x={x} dy="1.1em">
          {(percent * 100).toFixed(1)}% ({Number(value).toLocaleString()})
        </tspan>
      </text>
    );
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Customer Gender Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          {/* center total at same cx, cy as the pie */}
          <text
            x="45%"
            y="40%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#111827"
          >
            <tspan x="45%" dy="-0.2em" fontSize="14" fontWeight="600">
              Total
            </tspan>
            <tspan x="45%" dy="1.2em" fontSize="16" fontWeight="700">
              {total.toLocaleString()}
            </tspan>
          </text>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="45%"
            cy="60%"
            innerRadius={70}
            outerRadius={90}
            label={renderGenderLabel}
            paddingAngle={0}
            cornerRadius={10}
            labelLine={false}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val.toLocaleString()} customers`} />
        </PieChart>
      </ResponsiveContainer>


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
