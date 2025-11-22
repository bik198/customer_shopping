'use client';
export default function SalesFilterPanel({ filters, onFilterChange }) {
  return (
    <div className="bg-white shadow rounded p-6 w-72 flex-shrink-0 sticky top-24 h-fit">
      <h3 className="font-bold text-xl mb-6">Sales Filters</h3>
      
      {/* Age filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Age (min):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          value={filters.age[0]} 
          onChange={e => onFilterChange({ ...filters, age: [Number(e.target.value), filters.age[1]] })}
        />
        <label className="block text-sm font-semibold mt-4 mb-2">Age (max):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          value={filters.age[1]} 
          onChange={e => onFilterChange({ ...filters, age: [filters.age[0], Number(e.target.value)] })}
        />
      </div>

      {/* Purchase Amount */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Purchase Amount (min):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          value={filters.purchaseAmount[0]} 
          onChange={e => onFilterChange({ ...filters, purchaseAmount: [Number(e.target.value), filters.purchaseAmount[1]] })}
        />
        <label className="block text-sm font-semibold mt-4 mb-2">Purchase Amount (max):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          value={filters.purchaseAmount[1]} 
          onChange={e => onFilterChange({ ...filters, purchaseAmount: [filters.purchaseAmount[0], Number(e.target.value)] })}
        />
      </div>
    </div>
  );
}
