'use client';
import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ActualVsPredicted({ data }) {
  const chartData = useMemo(() => {
    return data
      .map(row => ({
        actual: parseFloat(row.Actual),
        predicted: parseFloat(row.Predicted)
      }))
      .filter(d => !isNaN(d.actual) && !isNaN(d.predicted));
  }, [data]);

  // Calculate min and max for perfect prediction line
  const minVal = Math.min(...chartData.map(d => Math.min(d.actual, d.predicted)));
  const maxVal = Math.max(...chartData.map(d => Math.max(d.actual, d.predicted)));

  const perfectLine = [
    { actual: minVal, predicted: minVal },
    { actual: maxVal, predicted: maxVal }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
          <p><strong>Actual:</strong> ${d.actual.toFixed(2)}</p>
          <p><strong>Predicted:</strong> ${d.predicted.toFixed(2)}</p>
          <p><strong>Error:</strong> ${Math.abs(d.actual - d.predicted).toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Actual vs Predicted Values</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="actual"
            name="Actual"
            label={{
              value: 'Actual Purchase Amount ($)',
              position: 'insideBottom',
              offset: -10
            }}
            domain={[0, 110]}
          />
          <YAxis
            type="number"
            dataKey="predicted"
            name="Predicted"
            label={{
              value: 'Predicted Purchase Amount ($)',
              angle: -90,
              position: 'insideBottomLeft',
              offset: 20,
              style: { fontSize: 14, fontWeight: 500 }
            }}
            domain={[0, 110]}
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

          {/* Perfect prediction line */}
          <Scatter
            name=""
            data={perfectLine}
            fill="none"
            line={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
            shape={() => null}
          />

          {/* Actual predictions */}
          <Scatter
            name="Predictions"
            data={chartData}
            fill="#ec4899"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-7">
        Points closer to the dashed line indicate better predictions.
      </p>
    </div>
  );
}
