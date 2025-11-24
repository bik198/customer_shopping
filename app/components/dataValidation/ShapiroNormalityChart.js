import Papa from "papaparse";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, Label } from 'recharts';

// Helper function to look up stats by column (case-insensitive)
function getRealShapiro(csv, col) {
  // Tolerant matching (ignore case, spaces, parens)
  const norm = s => s.toLowerCase().replace(/\s+|\(.*?\)/g, '');
  return csv.find(row => norm(row.Column) === norm(col));
}

// Normality chart using real CSV
function NormalityChartSection({ column, color, csv, shapiroCSV, name }) {
  const [data, setData] = useState([]);
  const stats = shapiroCSV ? getRealShapiro(shapiroCSV, column) : null;

  useEffect(() => {
    if (!csv) return;
    const vals = csv.map(r => parseFloat(r[column])).filter(x => !isNaN(x));
    const min = Math.floor(Math.min(...vals));
    const max = Math.ceil(Math.max(...vals));
    const binSize = (max - min) > 30 ? 2 : 0.2;
    const byBin = {};
    vals.forEach(x => {
      const bin = Math.round((x - min) / binSize) * binSize + min;
      byBin[bin] = (byBin[bin] || 0) + 1;
    });
    // Normal curve uses real stats from CSV
    const n = stats ? +stats["Sample Size"] : vals.length;
    const mean = stats ? +stats["Mean"] : (vals.reduce((a, b) => a + b, 0) / n);
    const std = stats ? +stats["Std Dev"] : (Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1)));
    const curve = [];
    Object.keys(byBin).forEach(bin => {
      const y = Math.exp(-0.5 * Math.pow((bin - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
      curve.push({ bin: parseFloat(bin), Observed: byBin[bin], Normal: y * n * binSize });
    });
    setData(curve.sort((a, b) => a.bin - b.bin));
  }, [csv, column, stats]);

  return (
    <div className="mb-10">
      <b className="text-l">{name} Normality</b>
      <div className="flex space-x-6 w-full mt-1">
        <div className="w-full" style={{ width: 700 }}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="5 7" />
              <XAxis dataKey="bin"
                label={<Label value="Value" position="insideBottom" dy={8} fontWeight={600} />}
                tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Line type="monotone" dataKey="Observed" stroke={color} strokeWidth={1} />
              <Line type="monotone" dataKey="Normal" stroke="#6366f1" strokeDasharray="4 2" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center items-start">
          {stats && (
            <>
              <div><span className="font-semibold">Sample Size:</span> {stats["Sample Size"]}</div>
              <div><span className="font-semibold">Mean:</span> {(+stats["Mean"]).toFixed(2)}</div>
              <div><span className="font-semibold">Std Dev:</span> {(+stats["Std Dev"]).toFixed(2)}</div>
              <div><span className="font-semibold">Shapiro-Wilk W:</span> {parseFloat(stats["Shapiro Statistic"]).toFixed(4)}</div>
              <div><span className="font-semibold">p-value:</span> {parseFloat(stats["p-value"]).toFixed(6)}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShapiroNormalityDashboard() {
  const [csv, setCSV] = useState(null);
  const [shapiroCSV, setShapiroCSV] = useState(null);

  useEffect(() => {
    Papa.parse('/shopping_behavior_cleaned.csv', { download: true, header: true, complete: res => setCSV(res.data) });
    Papa.parse('/shapiro_summary.csv', { download: true, header: true, complete: res => setShapiroCSV(res.data) });
  }, []);

  return (
    <div className="my-8">
      <h2 className="font-bold text-2xl mb-4">Normality: Shapiro-Wilk Test</h2>
      <div className="mb-4 p-4 bg-fuchsia-50 border-l-4 border-fuchsia-400 text-fuchsia-900 rounded shadow" style={{ textAlign: "justify" }}>
        <b>Shapiro-Wilk Normality Test Analysis:</b>
        <br />
        The Shapiro-Wilk test formally evaluates whether a numerical column follows a normal (Gaussian) distribution. For each variable, the test returns a <b>statistic (W)</b> and a <b>p-value</b>. If the p-value is very small (as shown here with <b>p-value: 0.000000</b>), we strongly reject the hypothesis of normality—indicating the data is not normally distributed.
        <br /><br />
        In genuine data, perfect normality is rare for natural measurements and essentially impossible for count data or bounded ratings. Extremely small p-values, as seen here, are typical for synthetic or randomized datasets, which fail to capture the natural clustering and irregularities present in real-world samples. As demonstrated, all tested columns yield p-values that round to zero, providing statistical confirmation that this sample is <b>not</b> normally distributed.
      </div>

      {!csv || !shapiroCSV ? <div>Loading...</div> : (
        <>
          <NormalityChartSection column="Review Rating" color="#f59e42" csv={csv} shapiroCSV={shapiroCSV} name="Review Rating" />
          <NormalityChartSection column="Purchase Amount" color="#6366f1" csv={csv} shapiroCSV={shapiroCSV} name="Purchase Amount" />
          <NormalityChartSection column="Previous Purchases" color="#38bdf8" csv={csv} shapiroCSV={shapiroCSV} name="Previous Purchases" />
          <NormalityChartSection column="Age" color="#22c55e" csv={csv} shapiroCSV={shapiroCSV} name="Age" />
        </>
      )}
    </div>
  );
}
