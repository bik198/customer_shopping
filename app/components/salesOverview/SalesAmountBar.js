'use client';
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function SalesAmountBar({ rawData, filters }) {
  const data = useMemo(() => {
    const filtered = rawData.filter(row => {
      let age = Number(row.Age);
      let amt = Number(row["Purchase Amount"]); // ✅ FIXED: removed (USD)
      return (
        !isNaN(age) && !isNaN(amt) &&
        age >= filters.age[0] && age <= filters.age[1] &&
        amt >= filters.purchaseAmount[0] && amt <= filters.purchaseAmount[1]
      );
    });
    
    const ageCounts = {};
    filtered.forEach(d => {
      let age = Number(d.Age);
      ageCounts[age] = (ageCounts[age] || 0) + 1;
    });
    
    return Object.entries(ageCounts).map(([age, count]) => ({ 
      age: Number(age), 
      count 
    }));
  }, [rawData, filters]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Sales by Age</h3>
      <BarChart width={600} height={300} data={data} isAnimationActive={true}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#38bdf8" animationDuration={800} />
      </BarChart>
    </div>
  );
}
