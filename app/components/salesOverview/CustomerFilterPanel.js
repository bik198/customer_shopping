'use client';
import { useRef } from 'react';
import Select, { components } from 'react-select';
import Slider from '@mui/material/Slider';

export default function CustomerFilterPanel({ filters, onFilterChange, states }) {
  const initialFiltersRef = useRef(filters);

  const allOption = { value: 'All', label: 'All' };

  const stateOptions = states
    .filter((state) => state !== 'All')
    .map((state) => ({ value: state, label: state }));

  const handleAgeChange = (_event, newValue) => {
    onFilterChange({ ...filters, age: newValue });
  };

  const handleReset = () => {
    onFilterChange(initialFiltersRef.current);
  };

  const Menu = (props) => (
    <components.Menu {...props}>
      <div
        className="px-3 py-2 cursor-pointer hover:bg-gray-100 font-medium border-b border-gray-200"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.selectOption(allOption);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.selectOption(allOption);
        }}
      >
        {allOption.label}
      </div>
      {props.children}
    </components.Menu>
  );

  return (
    <div>
      <h3 className="font-bold text-lg mb-6">Customer Filters</h3>

      <label className="block text-sm font-medium mb-1">State:</label>
      <Select
        options={stateOptions}
        value={
          filters.region === 'All'
            ? allOption
            : stateOptions.find((option) => option.value === filters.region) || null
        }
        onChange={(option) =>
          onFilterChange({ ...filters, region: option?.value || 'All' })
        }
        placeholder="All"
        isSearchable
        components={{ Menu }}
        className="mb-4"
      />

      <label className="block text-sm font-medium mb-1">Gender:</label>
      <select
        className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
        value={filters.gender}
        onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
      >
        <option value="All">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>Age range</span>
          <span className="text-gray-600">
            {filters.age[0]} – {filters.age[1]}
          </span>
        </div>
        <Slider
          aria-label="Customer age range"
          value={filters.age}
          onChange={handleAgeChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
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
