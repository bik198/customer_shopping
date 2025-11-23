'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ShippingRadarChart({ data }) {
  const radarData = Object.entries(data).map(([axis, value]) => ({ axis, value }));

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Sales by Shipping Type</h2>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis />
          <Tooltip />
          <Legend />
          <Radar name="Sales" dataKey="value" stroke="#f472b6" fill="#f472b6" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
