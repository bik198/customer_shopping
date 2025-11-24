'use client';
import Papa from "papaparse";
import { useEffect, useState } from "react";

const COLORS = ['#93c5fd', '#fde68a', '#6ee7b7', '#fca5a5', '#c4b5fd', '#f9a8d4'];

function getScaleY(val, plotHeight, minY = 0, maxY = 100) {
  return plotHeight - ((val - minY) / (maxY - minY)) * plotHeight;
}

// Boxplot SVG with React tooltip support
function BoxplotSVG({ data, minY = 0, maxY = 100, width = 850, height = 390 }) {
  const margin = { top: 30, right: 10, left: 70, bottom: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const n = data.length, boxWidth = Math.min(50, plotWidth / (n * 2));
  const gap = plotWidth / n;
  const [hoverIdx, setHoverIdx] = useState(null);

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height}>
        {/* Y-ticks */}
        {[0, 20, 40, 60, 80, 100].map((v, i) => {
          const py = margin.top + getScaleY(v, plotHeight, minY, maxY);
          return (
            <g key={i}>
              <line x1={margin.left - 4} x2={width - margin.right + 4} y1={py} y2={py} stroke="#e5e7eb" />
              <text x={margin.left - 14} y={py + 5} fontSize="17" textAnchor="end" fontWeight={700} fill="#636363">{v}</text>
            </g>
          );
        })}
        {/* Y-label */}
        <text
          x={24}
          y={margin.top + plotHeight / 2}
          textAnchor="middle"
          fill="#22223b"
          fontSize="15"
          fontWeight={800}
          transform={`rotate(-90, 24, ${margin.top + plotHeight / 2})`}
        >Purchase Amount (USD)</text>
        {/* X-ticks */}
        {data.map((d, i) => (
          <text
            key={d.payment}
            x={margin.left + gap * (i + 0.5)}
            y={height - 11}
            fontSize="18"
            fill="#171717"
            textAnchor="middle"
            fontWeight={700}
          >{d.payment}</text>
        ))}
        {/* Boxes, whiskers, median */}
        {data.map((d, i) => {
          const color = COLORS[i % COLORS.length];
          const cx = margin.left + gap * (i + 0.5);
          // Clamp positions so no overflow
          const yMin = margin.top + getScaleY(Math.max(0, d.min), plotHeight, minY, maxY);
          const yQ1 = margin.top + getScaleY(d.q1, plotHeight, minY, maxY);
          const yMed = margin.top + getScaleY(d.med, plotHeight, minY, maxY);
          const yQ3 = margin.top + getScaleY(d.q3, plotHeight, minY, maxY);
          const yMax = margin.top + getScaleY(Math.min(d.max, 100), plotHeight, minY, maxY);
          const isHovered = hoverIdx === i;
          return (
            <g key={d.payment} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              tabIndex={0}
              aria-label={`Boxplot for ${d.payment}`}>
              {/* Whiskers */}
              <line x1={cx} x2={cx} y1={yMax} y2={yQ3} stroke="#444" strokeWidth={3} />
              <line x1={cx} x2={cx} y1={yMin} y2={yQ1} stroke="#444" strokeWidth={3} />
              <line x1={cx - 17} x2={cx + 17} y1={yMax} y2={yMax} stroke="#444" strokeWidth={3} />
              <line x1={cx - 17} x2={cx + 17} y1={yMin} y2={yMin} stroke="#444" strokeWidth={3} />
              {/* Box */}
              <rect
                x={cx - boxWidth / 2}
                y={yQ3}
                width={boxWidth}
                height={Math.max(6, yQ1 - yQ3)}
                stroke={isHovered ? "#d97706" : "#222"}
                strokeWidth={isHovered ? 4.5 : 3}
                fill={color}
                fillOpacity={0.68}
                rx={10}
              />
              {/* Median line */}
              <line x1={cx - boxWidth / 2} x2={cx + boxWidth / 2} y1={yMed} y2={yMed} stroke="#e11d48" strokeWidth={5} />
            </g>
          );
        })}
      </svg>
      {/* React popover tooltips, always on top */}
      {hoverIdx !== null && (() => {
        const d = data[hoverIdx];
        const left = 70 + (plotWidth / n) * (hoverIdx + 0.5) - 78;
        const top = margin.top + getScaleY(d.q3, plotHeight, minY, maxY) - 75;
        return (
          <div
            style={{
              position: "absolute", left, top, zIndex: 10,
              pointerEvents: "none", background: "#fff", borderRadius: 12,
              border: "2px solid #f59e42", padding: "10px 17px", minWidth: 145,
              boxShadow: "0 6px 24px #aaa", fontSize: 15,
            }}>
            <b style={{ fontSize: 16 }}>{d.payment}</b><br />
            <span>N = {d.count}</span><br />
            <span>Min: ${d.min.toFixed(2)}</span><br />
            <span>Q1: ${d.q1.toFixed(2)}</span><br />
            <span>Median: ${d.med.toFixed(2)}</span><br />
            <span>Q3: ${d.q3.toFixed(2)}</span><br />
            <span>Max: ${d.max.toFixed(2)}</span>
          </div>
        );
      })()}
    </div>
  );
}

function prepareBoxplotData(csv) {
  const byPayment = {};
  csv.forEach(row => {
    const pay = row["Payment Method"];
    const amt = +row["Purchase Amount"];
    if (pay && !isNaN(amt)) {
      if (!byPayment[pay]) byPayment[pay] = [];
      byPayment[pay].push(amt);
    }
  });
  return Object.entries(byPayment).map(([payment, vals]) => {
    vals.sort((a, b) => a - b);
    const n = vals.length;
    const q1 = vals[Math.floor(n * 0.25)], med = vals[Math.floor(n * 0.5)], q3 = vals[Math.floor(n * 0.75)];
    const min = vals[0], max = vals[n - 1];
    return { payment, min, q1, med, q3, max, count: n };
  });
}

export default function PaymentMethodBoxplot() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Papa.parse('/shopping_behavior_cleaned.csv', {
      download: true,
      header: true,
      complete: res => setData(prepareBoxplotData(res.data))
    });
  }, []);

  return (
    <div className="my-8 px-1 w-full">
      <h2 className="font-bold text-2xl mb-5">Distribution of Spending by Payment Method</h2>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-5 mt-6 rounded shadow">
        <h3 className="font-bold mb-1 text-blue-800">Synthetic Data Analysis</h3>
        <div className="text-base text-blue-900" style={{ textAlign: "justify" }}>
          <p>
            Every payment method displays almost the same spread and central values, which is abnormal for true business data, where payment methods almost always show at least some differences. In real commercial datasets, unique customer preferences, transaction sizes, and payment type usage patterns typically produce boxplots with uneven distributions or noticeable shifts.
          </p>
          <p>
            The regularity and range found in these boxplots are another strong indicator that this dataset is synthetic or demonstration data. Such perfect similarity across all groups rarely, if ever, occurs naturally and reinforces the conclusion that the underlying numbers were generated artificially.
          </p>
        </div>

      </div>
      <div className="p-4 rounded bg-white shadow" style={{ overflowX: "auto", minWidth: 675 }}>
        {data && <BoxplotSVG data={data} />}
        {!data && <span>Loading...</span>}
      </div>
    </div>
  );
}
