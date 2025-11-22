'use client';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import Spinner from './Spinner';

export default function PurchaseAmountScatter() {
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const plotData = results.data
          .map(d => ({
            Age: Number(d.Age),
            PurchaseAmount: Number(
              typeof d["Purchase Amount"] === "string"
                ? d["Purchase Amount"].replace(/[^0-9.]/g, '')
                : d["Purchase Amount"]
            )
          }))
          .filter(d => !isNaN(d.Age) && !isNaN(d.PurchaseAmount));
        setScatterData(plotData);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 mb-8" style={{ minHeight: '350px' }}>
      <h2 className="text-xl font-semibold mb-2">Purchase Amount by Age</h2>
      {loading ? (
        <Spinner color="border-orange-400" />
      ) : (
        <ScatterChart width={600} height={300}>
          <CartesianGrid />
          <XAxis dataKey="Age" type="number" domain={['auto', 'auto']} />
          <YAxis dataKey="PurchaseAmount" type="number" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Scatter name="Data" data={scatterData} fill="#f59e42" />
        </ScatterChart>
      )}
    </div>
  );
}
