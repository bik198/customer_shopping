'use client';
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, LineChart, Line } from 'recharts';

const COLS = [
  ['Age', 'Age'],
  ['Purchase Amount', 'Purchase Amount'],
  ['Review Rating', 'Review Rating'],
  ['Previous Purchases', 'Previous Purchases']
];
const COLORS = { Male: "#3490dc", Female: "#fbbf24" };

function jitter(x, amount = 0.25) {
  return x + (Math.random() - 0.5) * amount;
}
function downsample(arr, maxPoints = 500) {
  if (!arr.length || arr.length <= maxPoints) return arr;
  const idx = new Set();
  while (idx.size < maxPoints) idx.add(Math.floor(Math.random() * arr.length));
  return Array.from(idx).map(i => arr[i]);
}
function formatTick(v) {
  return (Math.abs(v) < 1e-3 || Math.abs(v) > 1e3) ? v.toExponential(1) : Number(v).toFixed(1);
}

export default function GenderPairplot() {
  const [data, setData] = useState([]);
  const [kde, setKDE] = useState([]);
  useEffect(() => {
    Papa.parse('/shopping_behavior_cleaned.csv', { download: true, header: true, complete: res => setData(res.data) });
    Papa.parse('/diagonal_kde_data.csv', { download: true, header: true, dynamicTyping: true, complete: res => setKDE(res.data) });
  }, []);

  if (!data.length || !kde.length) return <div>Loading pairplot...</div>;

  const genderKey = 'Gender';
  const groups = { Male: [], Female: [] };
  data.forEach(r => { if (groups[r[genderKey]]) groups[r[genderKey]].push(r); });

  // Axis limits for all columns
  const colStats = {};
  COLS.forEach(([col]) => {
    const vals = data.map(r => Number(r[col])).filter(Number.isFinite);
    colStats[col] = { min: Math.min(...vals), max: Math.max(...vals) };
  });

  return (
    <div style={{
      padding: 24,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start"
    }}>
      <h2 className="text-2xl font-bold mb-5" style={{textAlign:"center"}}>Pairplot of Customer Data by Gender</h2>
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-300 rounded shadow text-base text-blue-900" style={{ textAlign: "justify" }}>
        <b>Analysis:</b>
        <br />
        This grid shows all pairwise combinations of the main numeric variables, colored by gender.
        Diagonal panels display kernel density (smoothed histogram); off-diagonals show scatter plots.
        Only the leftmost column has a y axis and label (for the row/feature, not the column); only the bottom row has an x axis and label. This strictly matches Seaborn pairplot conventions.
      </div>
      <div style={{
        display: "flex", justifyContent: "center", width:"100%", marginBottom: 12
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS.length}, 1fr)`,
          gridTemplateRows: `repeat(${COLS.length}, 1fr)`,
          gap: 10,
          width: "100%",
          maxWidth: 820,
          minWidth: 540,
          background: "#fff"
        }}>
          {COLS.map(([colX, xLabel], i) => COLS.map(([colY, yLabel], j) => (
            <div key={xLabel + yLabel}
              style={{
                width: "100%",
                height: 175,
                minHeight: 130,
                minWidth: 120,
                background: j === i ? "#f3f4f6" : "#fff",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
              {i === j ? (
                <LineChart width={155} height={140}>
                  <XAxis
                    dataKey="value"
                    type="number"
                    domain={[colStats[colX].min, colStats[colX].max]}
                    tickCount={4}
                    tick={{fontSize:12}}
                    tickFormatter={i === COLS.length-1 ? formatTick : () => ""}
                    label={i === COLS.length-1 ? { value: xLabel, position: "insideBottom", fontSize: 13, offset: -1 } : undefined}
                  />
                  <YAxis
                    dataKey="density"
                    type="number"
                    tick={{fontSize:12}}
                    tickFormatter={j === 0 ? formatTick : () => ""}
                    label={j === 0 ? { value: xLabel, angle: -90, position: "insideLeft", offset: 3, fontSize: 13 } : undefined}
                  />
                  {["Male", "Female"].map(g =>
                    <Line
                      key={g}
                      type="monotone"
                      data={kde.filter(row => row.gender === g && row.feature === colX)
                        .map(row => ({
                          ...row,
                          value: Number(row.value),
                          density: Number(row.density)
                        }))
                      }
                      dataKey="density"
                      name={g}
                      stroke={COLORS[g]}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              ) : (
                <ScatterChart width={155} height={140}>
                  <XAxis
                    dataKey={colY}
                    type="number"
                    domain={[colStats[colY].min, colStats[colY].max]}
                    tickCount={4}
                    tick={{fontSize: 12}}
                    tickFormatter={i === COLS.length-1 ? formatTick : () => ""}
                    label={i === COLS.length-1 ? { value: yLabel, position:"insideBottom", fontSize: 13, offset:-2 } : undefined}
                  />
                  <YAxis
                    dataKey={colX}
                    type="number"
                    domain={[colStats[colX].min, colStats[colX].max]}
                    tickCount={3}
                    tick={{fontSize: 12}}
                    tickFormatter={j === 0 ? formatTick : () => ""}
                    label={j === 0 ? { value: xLabel, angle: -90, position: "insideLeft", offset: 3, fontSize: 13 } : undefined}
                  />
                  {["Male", "Female"].map(g =>
                    <Scatter
                      key={g}
                      data={downsample(groups[g].map(r => ({
                        [colX]: Number(jitter(Number(r[colX]))),
                        [colY]: Number(jitter(Number(r[colY])))
                      })).filter(v => Number.isFinite(v[colX]) && Number.isFinite(v[colY])))}
                      fill={COLORS[g]}
                      shape="circle"
                      opacity={0.24}
                      legendType="circle"
                    />
                  )}
                </ScatterChart>
              )}
            </div>
          )))}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-6 text-sm font-semibold" style={{fontSize:16}}>
        <span style={{ color: COLORS.Male, letterSpacing:1 }}>&#11044; Male</span>
        <span style={{ color: COLORS.Female, letterSpacing:1 }}>&#11044; Female</span>
      </div>
    </div>
  );
}
