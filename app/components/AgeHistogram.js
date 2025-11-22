'use client';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Spinner from './Spinner';

export default function AgeHistogram() {
  const [ageHistData, setAgeHistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const ages = results.data.map(d => Number(d.Age)).filter(n => !isNaN(n));
        const ageCounts = {};
        ages.forEach(age => {
          ageCounts[age] = (ageCounts[age] || 0) + 1;
        });
        const histData = Object.entries(ageCounts).map(([age, count]) => ({
          age: Number(age),
          count: count
        }));
        setAgeHistData(histData);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 mb-8" style={{ minHeight: '350px' }}>
      <h2 className="text-xl font-semibold mb-2">Age Distribution</h2>
      {loading ? (
        <Spinner color="border-blue-400" />
      ) : (
        <BarChart width={600} height={300} data={ageHistData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#38bdf8" />
        </BarChart>
      )}
    </div>
  );
}
