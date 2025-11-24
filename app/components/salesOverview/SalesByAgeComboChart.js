'use client';
import { useMemo } from "react";
import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from "recharts";

export default function SalesByAgeComboChart({ rawData, filters }) {
  const data = useMemo(() => {
    const filtered = rawData.filter(row => {
      let age = Number(row.Age);
      let amt = Number(row["Purchase Amount"]);
      return (
        !isNaN(age) && !isNaN(amt) &&
        age >= filters.age[0] && age <= filters.age[1] &&
        amt >= filters.purchaseAmount[0] && amt <= filters.purchaseAmount[1]
      );
    });

    const ageGroups = {};
    filtered.forEach(d => {
      let age = Number(d.Age);
      let amt = Number(d["Purchase Amount"]);
      if (!ageGroups[age]) ageGroups[age] = { age, count: 0, totalAmount: 0 };
      ageGroups[age].count += 1;
      ageGroups[age].totalAmount += amt;
    });

    return Object.values(ageGroups)
      .map(({ age, count, totalAmount }) => ({
        age,
        count,
        avgAmount: count ? totalAmount / count : 0
      }))
      .sort((a, b) => a.age - b.age);
  }, [rawData, filters]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Sales by Age & Avg Purchase Amount</h3>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" />
          <YAxis
            yAxisId="left"
            stroke="#38bdf8"
            tick={{ fill: '#38bdf8', fontWeight: 600 }}
          >
            <Label
              value="Number of Sales"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle', fill: '#38bdf8', fontWeight: 600 }}
            />
          </YAxis>
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#f59e42"
            tick={{ fill: '#f59e42', fontWeight: 600 }}
          >
            <Label
              value="Avg Purchase Amount ($)"
              angle={90}
              position="insideRight"
              style={{ textAnchor: 'middle', fill: '#f59e42', fontWeight: 600 }}
            />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="count"
            fill="#38bdf8"
            name="Number of Sales"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgAmount"
            stroke="#f59e42"
            strokeWidth={2}
            name="Avg Purchase Amount"
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
