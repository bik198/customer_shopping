'use client';
import Select from 'react-select';

export default function CustomerFilterPanel({ filters, onFilterChange, states }) {
  // Always add "All" as first option
  const restStates = states.filter(state => state !== "All");
  const stateOptions = [
    { value: "All", label: "All" },
    ...restStates.map(state => ({
      value: state,
      label: state
    }))
  ];

  // Keeps "All" visible at top no matter the search
  const filterOption = (option, inputValue) => {
    if (option.value === "All") return true;
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-6">Customer Filters</h3>
      
      {/* State filter with react-select, custom filterOption */}
      <label className="block text-sm font-medium mb-1">State:</label>
      <Select
        options={stateOptions}
        value={stateOptions.find(option => option.value === filters.region)}
        onChange={option =>
          onFilterChange({ ...filters, region: option.value })
        }
        placeholder="Select state..."
        isSearchable
        filterOption={filterOption}
        className="mb-4"
      />

      {/* Gender dropdown */}
      <label className="block text-sm font-medium mb-1">Gender:</label>
      <select
        className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
        value={filters.gender}
        onChange={e => onFilterChange({ ...filters, gender: e.target.value })}
      >
        <option value="All">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {/* Age min */}
      <label className="block text-sm font-medium mb-1">Age (min):</label>
      <input
        type="number"
        className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
        value={filters.age[0]}
        onChange={e => onFilterChange({
          ...filters, age: [Number(e.target.value), filters.age[1]]
        })}
      />

      {/* Age max */}
      <label className="block text-sm font-medium mb-1">Age (max):</label>
      <input
        type="number"
        className="w-full border border-gray-300 rounded px-2 py-2 mb-2"
        value={filters.age[1]}
        onChange={e => onFilterChange({
          ...filters, age: [filters.age[0], Number(e.target.value)]
        })}
      />
    </div>
  );
}
