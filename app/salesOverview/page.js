'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import SalesAmountBar from '../../app/components/salesOverview/SalesAmountBar';
import SalesTrendLine from '../../app/components/salesOverview/SalesTrendLine';
import SalesFilterPanel from '../../app/components/salesOverview/SalesFilterPanel';

export default function SalesOverview() {
  const [rawData, setRawData] = useState([]); // Store parsed CSV once
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    age: [20, 70],
    purchaseAmount: [0, 1000],
  });

  // Parse CSV ONCE on mount
  useEffect(() => {
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setRawData(results.data);
        setLoading(false);
      }
    });
  }, []); // Empty dependency - runs only once

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-row gap-8 px-8 py-4">
      <div className="flex-1 space-y-8">
        <SalesAmountBar rawData={rawData} filters={filters} />
        <SalesTrendLine rawData={rawData} filters={filters} />
      </div>
      <SalesFilterPanel filters={filters} onFilterChange={setFilters} />
    </div>
  );
}
