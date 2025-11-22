'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import ProductCategoryBar from '../../app/components/productDetails/ProductCategoryBar';
import ProductRatingPie from '../../app/components/productDetails/ProductRatingPie';
import ProductFilterPanel from '../../app/components/productDetails/ProductFilterPanel';

export default function ProductDetails() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "All",
    rating: [1, 5],
    price: [0, 100],
  });

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
        <ProductCategoryBar rawData={rawData} filters={filters} />
        <ProductRatingPie rawData={rawData} filters={filters} />
      </div>
      <ProductFilterPanel filters={filters} onFilterChange={setFilters} />
    </div>
  );
}
