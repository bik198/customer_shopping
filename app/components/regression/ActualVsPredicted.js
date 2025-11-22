'use client';
import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

export default function ActualVsPredicted({ data }) {
  const chartData = useMemo(() => {
    return data.map(row => ({
      actual: parseFloat(row.Actual),
      predicted: parseFloat(row.Predicted)
    })).filter(d => !isNaN(d.actual) && !isNaN(d.predicted));
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
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
          <p><strong>Actual:</strong> ${data.actual.toFixed(2)}</p>
          <p><strong>Predicted:</strong> ${data.predicted.toFixed(2)}</p>
          <p><strong>Error:</strong> ${Math.abs(data.actual - data.predicted).toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Actual vs Predicted Values</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="actual" 
            name="Actual"
            label={{ value: 'Actual Purchase Amount ($)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="predicted" 
            name="Predicted"
            label={{ value: 'Predicted Purchase Amount ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Perfect prediction line */}
          <Scatter 
            name="Perfect Prediction" 
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
      <p className="text-sm text-gray-600 mt-3">
        Points closer to the dashed line indicate better predictions.
      </p>
    </div>
  );
}
