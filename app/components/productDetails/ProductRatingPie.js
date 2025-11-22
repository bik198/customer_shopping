'use client';
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const RATING_COLORS = ['#ef4444', '#f59e42', '#fbbf24', '#10b981', '#3b82f6'];

export default function ProductRatingPie({ rawData, filters }) {
  const pieData = useMemo(() => {
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
    
    const ratingBuckets = { "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5": 0 };
    filtered.forEach(d => {
      const rating = Number(d["Review Rating"]);
      if (isNaN(rating)) return;
      if (rating < 2) ratingBuckets["1-2"]++;
      else if (rating < 3) ratingBuckets["2-3"]++;
      else if (rating < 4) ratingBuckets["3-4"]++;
      else if (rating < 5) ratingBuckets["4-5"]++;
      else ratingBuckets["5"]++;
    });
    
    return Object.entries(ratingBuckets)
      .filter(([_, count]) => count > 0)
      .map(([range, count]) => ({ name: range, value: count }));
  }, [rawData, filters]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-xl mb-4">Product Rating Distribution</h3>
      <PieChart width={400} height={320}>
        <Pie
          data={pieData}
          cx={200}
          cy={150}
          labelLine={false}
          label={({ name, percent }) => `${name} ★: ${(percent * 100).toFixed(1)}%`}
          outerRadius={110}
          fill="#818cf8"
          dataKey="value"
          isAnimationActive={true}
          animationDuration={800}
        >
          {pieData.map((entry, idx) => (
            <Cell key={`cell-rating-${idx}`} fill={RATING_COLORS[idx % RATING_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
