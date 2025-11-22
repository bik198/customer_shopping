'use client';
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function SalesTrendLine({ rawData, filters }) {
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
    
    const ageAmounts = {};
    const ageCounts = {};
    
    filtered.forEach(d => {
      let age = Number(d.Age);
      let amt = Number(d["Purchase Amount"]); // ✅ FIXED: removed (USD)
      if (!isNaN(age) && !isNaN(amt)) {
        ageAmounts[age] = (ageAmounts[age] || 0) + amt;
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      }
    });
    
    return Object.entries(ageAmounts)
      .map(([age, total]) => ({
        age: Number(age),
        avgAmount: total / ageCounts[age]
      }))
      .sort((a, b) => a.age - b.age);
      
  }, [rawData, filters]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Average Purchase Amount by Age</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Avg Purchase ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Line 
            type="monotone" 
            dataKey="avgAmount" 
            stroke="#f59e42" 
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
