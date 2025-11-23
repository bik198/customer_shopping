'use client';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

// Colors for rings (adjust as you like)
const GENDER_COLORS = ['#6366f1', '#f472b6'];
const AGE_COLORS = [
  '#818cf8', '#22c55e', '#f59e42', '#f472b6', '#0ea5e9', '#fbbf24', '#38bdf8'
];
const AGE_LABELS = {
  '0-18': '0–18',
  '19-25': '19–25',
  '26-35': '26–35',
  '36-45': '36–45',
  '46-55': '46–55',
  '56-65': '56–65',
  '66+': '66+',
};

export default function SalesByAgeGroupGenderPieChart({ rawData }) {
  // Compute Gender Totals
  const genderTotals = { Male: 0, Female: 0 };
  rawData.forEach(row => {
    if (row.Gender === 'Male' || row.Gender === 'Female') {
      const amt = Number(row["Purchase Amount"]) || Number(row["Purchase Amount (USD)"]) || 0;
      genderTotals[row.Gender] += amt;
    }
  });
  const genderData = [
    { name: 'Male', value: genderTotals.Male },
    { name: 'Female', value: genderTotals.Female }
  ];

  // Compute Age Group Totals (all ages, combined genders)
  const ageTotals = {};
  rawData.forEach(row => {
    if (row.Gender === 'Male' || row.Gender === 'Female') {
      const group = row["Age Group"] || row["Age_Group"] || row["Age group"] || '';
      const key = AGE_LABELS[group] || group;
      const amt = Number(row["Purchase Amount"]) || Number(row["Purchase Amount (USD)"]) || 0;
      if (!key) return;
      if (!ageTotals[key]) ageTotals[key] = 0;
      ageTotals[key] += amt;
    }
  });
  const ageData = Object.entries(ageTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Sales by Age Group and Gender</h3>
      <ResponsiveContainer width="100%" height={370}>
        <PieChart>
          {/* Inner: Gender */}
          <Pie
            data={genderData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={105}
            paddingAngle={8}
            cornerRadius={20}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            labelLine={false}
          >
            {genderData.map((entry, idx) => <Cell key={entry.name} fill={GENDER_COLORS[idx % GENDER_COLORS.length]} />)}
          </Pie>
          {/* Outer: Age Group */}
          <Pie
            data={ageData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={115}
            outerRadius={155}
            paddingAngle={8}
            cornerRadius={20}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            labelLine={false}
          >
            {ageData.map((entry, idx) => <Cell key={entry.name} fill={AGE_COLORS[idx % AGE_COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={value => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
