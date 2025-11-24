'use client';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const freqOrder = [
  "None", "Daily", "Weekly", "Bi-Weekly", "Fortnightly", "Monthly",
  "Quarterly", "Annually", "Every 3 Months"
];

// Format numbers as "1k", "23k", etc.
const formatK = val => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;

export default function PrevPurchaseFreqAreaChart({ rawData }) {
  // Aggregate Previous Purchases by Frequency of Purchases
  const byFreq = {};
  (rawData || []).forEach(row => {
    const freq = row["Frequency of Purchases"]?.trim() || "0";
    const prev = Number(row["Previous Purchases"]) || 0;
    if (!byFreq[freq]) byFreq[freq] = { sum: 0, count: 0 };
    byFreq[freq].sum += prev;
    byFreq[freq].count += 1;
  });
  const chartData = Object.entries(byFreq).map(([freq, stats]) => ({
    freq,
    sum: stats.sum,
    avg: stats.count > 0 ? stats.sum / stats.count : 0,
    count: stats.count
  })).sort((a, b) => freqOrder.indexOf(a.freq) - freqOrder.indexOf(b.freq));

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">Previous Purchases Trend by Frequency</h3>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={chartData}>
          <XAxis dataKey="freq" />
          <YAxis
            yAxisId="left"
            label={{
              value: 'Total Prev Purchases',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: "#6366f1"
            }}
            tick={{ fill: "#6366f1" }}
            tickFormatter={formatK}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Avg Prev Purchases',
              angle: 90,
              position: 'insideRight',
              offset: 15,
              fill: "#f59e42"
            }}
            tick={{ fill: "#f59e42" }}
            // usually avg values don't need abbreviating
          />
          <Tooltip />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="sum"
            name="Total Prev Purchases"
            stroke="#6366f1"
            fill="#c7d2fe"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg"
            name="Avg Prev Purchases"
            stroke="#f59e42"
            strokeWidth={3}
            dot
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
