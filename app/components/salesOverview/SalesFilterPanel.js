'use client';
import { useRef } from 'react';
import Slider from '@mui/material/Slider';

export default function SalesFilterPanel({ filters, onFilterChange }) {
  const initialFiltersRef = useRef(filters);

  const handleReset = () => {
    onFilterChange(initialFiltersRef.current);
  };

  const handleAgeChange = (_, newValue) => {
    const [min, max] = newValue;
    onFilterChange({ ...filters, age: [min, max] });
  };

  const handleAmountChange = (_, newValue) => {
    const [min, max] = newValue;
    onFilterChange({ ...filters, purchaseAmount: [min, max] });
  };

  return (
    <div className="bg-white shadow rounded p-6 w-full h-[440px]">
      <h3 className="font-bold text-lg mb-6">Sales Filters</h3>

      {/* Age slider */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>Age range</span>
          <span className="text-gray-600">
            {filters.age[0]} – {filters.age[1]}
          </span>
        </div>
        <Slider
          value={filters.age}
          onChange={handleAgeChange}
          valueLabelDisplay="auto"
          min={18}
          max={80}
        />
      </div>

      {/* Purchase amount slider */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>Purchase Amount ($)</span>
          <span className="text-gray-600">
            {filters.purchaseAmount[0]} – {filters.purchaseAmount[1]}
          </span>
        </div>
        <Slider
          value={filters.purchaseAmount}
          onChange={handleAmountChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          step={1}
        />
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}
