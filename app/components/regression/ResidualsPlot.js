'use client';
import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";

export default function ResidualsPlot({ data }) {
  const chartData = useMemo(() => {
    return data.map(row => ({
      predicted: parseFloat(row.Predicted),
      residual: parseFloat(row.Residual)
    })).filter(d => !isNaN(d.predicted) && !isNaN(d.residual));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
          <p><strong>Predicted:</strong> ${data.predicted.toFixed(2)}</p>
          <p><strong>Residual:</strong> ${data.residual.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Residual Plot</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="predicted" 
            name="Predicted"
            label={{ value: 'Predicted Values ($)', position: 'insideBottom', offset: -10 }}
            domain={[20, 100]}
          />
          <YAxis 
            type="number" 
            dataKey="residual" 
            name="Residual"
            label={{
              value: 'Residuals ($)',
              angle: -90,
              position: 'insideMiddleLeft',
              offset: 20,
              style: { fontSize: 14, fontWeight: 500 }
            }}
            domain={[-60, 60]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            wrapperStyle={{
              fontSize: 14,
              fontWeight: 400,
              bottom: -15,
            }}
            iconType="circle"
          />
          <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
          <Scatter
            name="Residuals"
            data={chartData}
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-7">
        Random scatter around zero indicates good model fit. Patterns suggest model issues.
      </p>
    </div>
  );
}
