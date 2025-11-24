'use client';
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

// KDE logic as before...
function gaussian(x, bw) {
  return Math.exp(-0.5 * (x / bw) ** 2) / (bw * Math.sqrt(2 * Math.PI));
}
function kdeEstimator(values, xDomain, bandwidth, n = 75) {
  const min = xDomain[0], max = xDomain[1];
  const xs = Array.from({ length: n }, (_, i) => min + (i * (max - min)) / (n - 1));
  const ys = xs.map(x =>
    values.reduce((sum, v) => sum + gaussian(x - v, bandwidth), 0) / values.length
  );
  return xs.map((x, i) => ({ x, y: ys[i] }));
}

export default function DataValidationKDE() {
  const [plots, setPlots] = useState({});

  useEffect(() => {
    Papa.parse('/shopping_behavior_cleaned.csv', {
      download: true,
      header: true,
      complete: (res) => {
        const d = res.data;
        const getVals = col => d.map(r => +r[col]).filter(x => !isNaN(x));
        setPlots({
          Age: kdeEstimator(getVals('Age'), [10, 80], 2.5, 80),
          'Purchase Amount': kdeEstimator(getVals('Purchase Amount'), [10, 110], 4, 80),
          'Review Rating': kdeEstimator(getVals('Review Rating'), [2, 6], 0.15, 80),
          'Previous Purchases': kdeEstimator(getVals('Previous Purchases'), [0, 60], 2, 80),
        });
      }
    });
  }, []);

  // Formatting helpers
  const intTick = x => Number(x).toFixed(0);
  const oneDec = x => Number(x).toFixed(1);

  const chartStyle = { height: 180, width: '100%' };

  const analysis = (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded mb-8 shadow-sm">
      <h3 className="text-xl font-bold mb-2 text-yellow-800">Synthetic Data Signature: Flat Uniform KDE</h3>
      <div className="text-yellow-900 text-base" style={{ textAlign: "justify" }}>
        <p>
          All main variables show nearly flat, “tabletop” distributions instead of the clustered bell or skewed shapes found in real human data. This extreme uniformity—with abrupt drop-offs at minimum and maximum values—suggests random sampling across the entire allowed range, not actual behavioral or business statistics.
        </p>
        <p>
          In actual customer data, distributions are uneven: most people are close to a typical age or spending amount, reviews cluster near an average, and repeat purchases favor lower numbers—none of which appear here.
        </p>
        <p>
          These KDEs provide clear, visual statistical proof of artificial or practice dataset generation.
        </p>
      </div>

    </div>
  );

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">EDA (Smooth Kernel Density)</h2>
      {analysis}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="font-semibold text-lg mb-1">Age Distribution</div>
          <ResponsiveContainer {...chartStyle}>
            <LineChart data={plots.Age}>
              <XAxis dataKey="x" tickFormatter={intTick} label={{ value: "Age", position: "insideBottom", dy: 8 }} />
              <YAxis label={{ value: "Density", angle: -90, position: "insideLeft" }} domain={[0, 'auto']} />
              <Line type="monotone" dataKey="y" stroke="#6366f1" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">Purchase Amount Distribution</div>
          <ResponsiveContainer {...chartStyle}>
            <LineChart data={plots['Purchase Amount']}>
              <XAxis dataKey="x" tickFormatter={oneDec} label={{ value: "Amount ($)", position: "insideBottom", dy: 8 }} />
              <YAxis label={{ value: "Density", angle: -90, position: "insideLeft" }} domain={[0, 'auto']} />
              <Line type="monotone" dataKey="y" stroke="#f59e42" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">Review Rating Distribution</div>
          <ResponsiveContainer {...chartStyle}>
            <LineChart data={plots['Review Rating']}>
              <XAxis dataKey="x" tickFormatter={oneDec} label={{ value: "Rating", position: "insideBottom", dy: 8 }} />
              <YAxis label={{ value: "Density", angle: -90, position: "insideLeft" }} domain={[0, 'auto']} />
              <Line type="monotone" dataKey="y" stroke="#22c55e" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">Previous Purchases Distribution</div>
          <ResponsiveContainer {...chartStyle}>
            <LineChart data={plots['Previous Purchases']}>
              <XAxis dataKey="x" tickFormatter={intTick} label={{ value: "Previous Purchases", position: "insideBottom", dy: 8 }} />
              <YAxis label={{ value: "Density", angle: -90, position: "insideLeft" }} domain={[0, 'auto']} />
              <Line type="monotone" dataKey="y" stroke="#38bdf8" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
