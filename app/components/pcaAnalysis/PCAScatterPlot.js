'use client';
import { useMemo, useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis, ResponsiveContainer } from "recharts";

// Color mapping for categories
const CATEGORY_COLORS = {
  'Clothing': '#6366f1',
  'Footwear': '#10b981',
  'Outerwear': '#f59e42',
  'Accessories': '#ec4899'
};

export default function PCAScatterPlot({ data, selectedPCs, varianceData, categoryFilter }) {
  const [localLoading, setLocalLoading] = useState(true);

  // Track when selectedPCs or categoryFilter or data changes
  useEffect(() => {
    setLocalLoading(true);

    // simulate computation/loading delay (remove setTimeout in production)
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 500); // ← adjust or remove this for real pyodide/computation load

    // If you fetch or compute, set loading false in actual callback
    return () => clearTimeout(timer);
  }, [data, selectedPCs, categoryFilter]);

  const scatterData = useMemo(() => {
    let filtered = data?.map(row => ({
      x: parseFloat(row[selectedPCs.x]),
      y: parseFloat(row[selectedPCs.y]),
      age: parseInt(row.Age),
      amount: parseInt(row['Purchase Amount']),
      category: row.Category,
      gender: row.Gender,
      location: row.Location
    })).filter(d => !isNaN(d.x) && !isNaN(d.y)) ?? [];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }
    return filtered;
  }, [data, selectedPCs, categoryFilter]);

  const categorizedData = useMemo(() => {
    const groups = {};
    scatterData.forEach(point => {
      const cat = point.category || 'Unknown';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(point);
    });
    return groups;
  }, [scatterData]);

  const getVariance = (pc) => {
    const variance = varianceData.find(v => v.Component === pc);
    return variance ? (parseFloat(variance.Variance) * 100).toFixed(2) : '0.00';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
          <p className="font-semibold text-purple-600 mb-1">{d.category}</p>
          <p><strong>{selectedPCs.x}:</strong> {d.x.toFixed(3)}</p>
          <p><strong>{selectedPCs.y}:</strong> {d.y.toFixed(3)}</p>
          <hr className="my-2" />
          <p><strong>Age:</strong> {d.age}</p>
          <p><strong>Amount:</strong> ${d.amount}</p>
          <p><strong>Gender:</strong> {d.gender}</p>
          <p><strong>Location:</strong> {d.location}</p>
        </div>
      );
    }
    return null;
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400 mr-2"></span>
        <span className="text-purple-700 font-medium text-lg">Loading PCA...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {selectedPCs.x} vs {selectedPCs.y} Projection by Product Category
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {categoryFilter === 'All'
          ? `Showing all ${scatterData.length} customers across all categories`
          : `Showing ${scatterData.length} customers in ${categoryFilter}`
        }
      </p>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 80, bottom: 0, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="x"
            name={selectedPCs.x}
            label={{
              value: `${selectedPCs.x} (${getVariance(selectedPCs.x)}% variance)`,
              position: 'insideBottom',
              offset: 0,
              style: { fontSize: 14, fontWeight: 500 }
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={selectedPCs.y}
            label={{
              value: `${selectedPCs.y} (${getVariance(selectedPCs.y)}% variance)`,
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 14, fontWeight: 500 }
            }}
            tick={{ fontSize: 12 }}
          />
          <ZAxis range={[40, 120]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 14, fontWeight: 300, marginTop: 0, paddingTop: 20 }}
            iconType="circle"
          />
          {Object.entries(categorizedData).map(([category, points], idx) => (
            <Scatter
              key={category}
              name={category}
              data={points}
              fill={CATEGORY_COLORS[category] || '#94a3b8'}
              fillOpacity={0.65}
              isAnimationActive={true}
              animationBegin={200 + idx * 100}
              animationDuration={900}
              animationEasing="ease-out"
              line={false}
            />
          ))}

        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200 text-sm text-gray-700">
        <strong className="text-purple-700">Visualization Tip:</strong> Points are semi-transparent to show density.
        Darker areas indicate higher customer concentration. Try different PC combinations or category filters for better separation.
      </div>
    </div>
  );
}
