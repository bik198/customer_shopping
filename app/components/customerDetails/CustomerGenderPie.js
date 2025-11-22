'use client';
import { useMemo } from "react";
import Spinner from '../Spinner';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const GENDER_COLORS = ["#38bdf8", "#f59e42", "#34d399", "#f472b6"];

export default function CustomerGenderPie({ rawData, filters }) {
  const genderPieData = useMemo(() => {
    const filtered = rawData.filter(row => {
      let age = Number(row.Age);
      let gender = row.Gender || "Unknown";
      let location = row.Location || "Unknown";
      return (
        (filters.region === "All" || location === filters.region) &&
        (filters.gender === "All" || gender === filters.gender) &&
        !isNaN(age) && age >= filters.age[0] && age <= filters.age[1]
      );
    });
    
    const genderCounts = {};
    filtered.forEach(d => {
      const gender = d.Gender?.trim() || "Unknown";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });
    
    return Object.entries(genderCounts).map(([gender, count]) => ({ 
      name: gender, 
      value: count 
    }));
  }, [rawData, filters]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-xl mb-4">Customer Gender Distribution</h3>
      <PieChart width={400} height={320}>
        <Pie
          data={genderPieData}
          cx={200}
          cy={150}
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          outerRadius={110}
          fill="#38bdf8"
          dataKey="value"
          isAnimationActive={true}
          animationDuration={800}
        >
          {genderPieData.map((entry, idx) => (
            <Cell key={`cell-gender-${idx}`} fill={GENDER_COLORS[idx % GENDER_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
