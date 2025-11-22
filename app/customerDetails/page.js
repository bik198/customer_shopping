'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import dynamic from 'next/dynamic';
import CustomerGenderPie from '../../app/components/customerDetails/CustomerGenderPie';
import CustomerFilterPanel from '../../app/components/customerDetails/CustomerFilterPanel';

// Dynamically import map with SSR disabled
const CustomerLocationMap = dynamic(
  () => import('../../app/components/customerDetails/CustomerLocationMap'),
  { ssr: false }
);

export default function CustomerDetails() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: "All",
    gender: "All",
    age: [20, 70],
  });

  // Parse CSV once on mount
  useEffect(() => {
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setRawData(results.data);
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-row gap-8 px-8 py-4">
      <div className="flex-1 space-y-8">
        <CustomerGenderPie rawData={rawData} filters={filters} />
        <CustomerLocationMap rawData={rawData} filters={filters} />
      </div>
      <CustomerFilterPanel filters={filters} onFilterChange={setFilters} />
    </div>
  );
}
