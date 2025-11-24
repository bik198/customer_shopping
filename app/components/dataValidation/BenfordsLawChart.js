'use client';
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, Label, CartesianGrid } from 'recharts';

function benfordBars(data, col) {
  const counts = Array(9).fill(0);
  let total = 0;
  data.forEach(row => {
    const val = Math.abs(Number(row[col]));
    if (val > 0) {
      const digit = parseInt(String(Math.floor(val)).charAt(0));
      if (digit >= 1 && digit <= 9) {
        counts[digit - 1]++;
        total++;
      }
    }
  });
  const benfordProbs = [0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
  return counts.map((count, i) => ({
    digit: i + 1,
    Observed: count / total,
    Count: count,
    Benford: benfordProbs[i]
  }));
}

function BenfordTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div style={{
      background: '#fff', borderRadius: 13, border: '2.5px solid #6ea8fe',
      padding: "12px 18px", minWidth: 170, fontSize: 15, color: "#19304f"
    }}>
      <div style={{ color: "#19304f", fontSize: 17 }}>Leading Digit: {row.digit}</div>
      <div style={{ color: "#FF0000" }}>Benford's Law: <b>{row.Benford.toFixed(3)}</b></div>
      <div style={{ color: "#6ea8fe" }}>Observed Proportion: <b>{row.Observed.toFixed(3)}</b></div>
      <div style={{ color: "#444" }}>Count: {row.Count}</div>
    </div>
  );
}

export default function BenfordsLawChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    Papa.parse('/shopping_behavior_cleaned.csv', {
      download: true,
      header: true,
      complete: res => setData(benfordBars(res.data, 'Purchase Amount'))
    });
  }, []);

  return (
    <div className="my-10">
      <h2 className="text-xl mb-2 font-bold">Benford's Law Analysis: Real vs. Dataset</h2>
      <div className="mb-4 bg-blue-50 border-l-4 border-blue-300 p-4 rounded shadow text-base text-blue-900" style={{ textAlign: "justify" }}>
        The bars show the observed frequency of each leading digit in the data, while the red curve is Benford's Law—the expected pattern for real-world numbers. In genuine datasets, lower digits like '1' appear much more often and the bars decline smoothly. Here, the bars are nearly flat across all digits, which is a clear statistical signal of artificial or randomly generated data that does not match natural patterns.
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          barCategoryGap={10}
          margin={{ top: 24, right: 35, left: 25, bottom: 38 }}
        >
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis
            dataKey="digit"
            type="number"
            allowDecimals={false}
            domain={[1, 9]}
            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            label={
              <Label
                value="Leading Digit"
                position="bottom"
                dy={16}
                fontWeight={700}
                fontSize={17}
              />
            }
            tick={{ fontSize: 17, fontWeight: 800, fill: "#273046" }}
            interval={0}
            padding={{ left: 48, right: 48 }} // <<< increased for extra gap
            minTickGap={1}
          />
          <YAxis
            domain={[0, 0.35]}
            ticks={[0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35]}
            label={
              <Label
                value="Proportion"
                angle={-90}
                position="insideLeft"
                dx={-5}
                fontWeight={600}
                fontSize={18}
              />
            }
            tickFormatter={v => v.toFixed(2)}
            tick={{ fontSize: 17, fontWeight: 800, fill: "#19304f" }}
            minTickGap={8}
          />
          <Tooltip content={<BenfordTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              fontWeight: 800, fontSize: 14, marginBottom: 2, marginTop: 8,
              position: 'relative', right: 0, top: 0
            }}
          />
          <Bar
            dataKey="Observed"
            name="Observed Proportion"
            fill="#6ea8fe"
            barSize={34}
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="Benford"
            name="Benford's Law"
            stroke="#FF0000"
            strokeWidth={2}
            dot={{ r: 4, fill: "#FF0000" }}
            activeDot={{ r: 6, fill: "#fff", stroke: "#FF0000", strokeWidth: 4 }}
            legendType="plainline"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
