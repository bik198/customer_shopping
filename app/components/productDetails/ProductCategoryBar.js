'use client';
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const CATEGORY_COLORS = ['#6366f1', '#10b981', '#f59e42', '#ec4899'];

export default function ProductCategoryBar({ rawData, filters }) {
  const categoryData = useMemo(() => {
    const filtered = rawData.filter(row => {
      let category = row.Category || "Unknown";
      let rating = Number(row["Review Rating"]);
      let price = Number(row["Purchase Amount"]); // ✅ FIXED: removed (USD)
      return (
        (filters.category === "All" || category === filters.category) &&
        !isNaN(rating) && rating >= filters.rating[0] && rating <= filters.rating[1] &&
        !isNaN(price) && price >= filters.price[0] && price <= filters.price[1]
      );
    });
    
    const categoryCounts = {};
    filtered.forEach(d => {
      const category = d.Category?.trim() || "Unknown";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({ 
      category, 
      count 
    }));
  }, [rawData, filters]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-xl mb-4">Product Category Distribution</h3>
      <BarChart width={550} height={320} data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#fbbf24" isAnimationActive={true} animationDuration={800}>
          {categoryData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
