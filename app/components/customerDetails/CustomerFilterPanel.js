'use client';
export default function CustomerFilterPanel({ filters, onFilterChange }) {
  return (
    <div className="bg-white shadow rounded p-6 w-72 flex-shrink-0 sticky top-24 h-fit">
      <h3 className="font-bold text-xl mb-6">Customer Filters</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">State:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
          value={filters.region} 
          onChange={e => onFilterChange({ ...filters, region: e.target.value })}
        >
          <option>All</option>
          <option>Texas</option>
          <option>California</option>
          <option>Florida</option>
          <option>New York</option>
          <option>Hawaii</option>
          {/* Add more states as needed */}
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Gender:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
          value={filters.gender} 
          onChange={e => onFilterChange({ ...filters, gender: e.target.value })}
        >
          <option>All</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Age (min):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
          value={filters.age[0]} 
          onChange={e => onFilterChange({ ...filters, age: [Number(e.target.value), filters.age[1]] })}
        />
        <label className="block text-sm font-semibold mt-4 mb-2">Age (max):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
          value={filters.age[1]} 
          onChange={e => onFilterChange({ ...filters, age: [filters.age[0], Number(e.target.value)] })}
        />
      </div>
    </div>
  );
}
