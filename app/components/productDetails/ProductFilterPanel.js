'use client';
export default function ProductFilterPanel({ filters, onFilterChange }) {
  return (
    <div className="bg-white shadow rounded p-6 w-72 flex-shrink-0 sticky top-24 h-fit">
      <h3 className="font-bold text-xl mb-6">Product Filters</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Category:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          value={filters.category} 
          onChange={e => onFilterChange({ ...filters, category: e.target.value })}
        >
          <option>All</option>
          <option>Clothing</option>
          <option>Footwear</option>
          <option>Outerwear</option>
          <option>Accessories</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Rating (min):</label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          step="0.1"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          value={filters.rating[0]} 
          onChange={e => onFilterChange({ ...filters, rating: [Number(e.target.value), filters.rating[1]] })}
        />
        <label className="block text-sm font-semibold mt-4 mb-2">Rating (max):</label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          step="0.1"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          value={filters.rating[1]} 
          onChange={e => onFilterChange({ ...filters, rating: [filters.rating[0], Number(e.target.value)] })}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Price (min):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          value={filters.price[0]} 
          onChange={e => onFilterChange({ ...filters, price: [Number(e.target.value), filters.price[1]] })}
        />
        <label className="block text-sm font-semibold mt-4 mb-2">Price (max):</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          value={filters.price[1]} 
          onChange={e => onFilterChange({ ...filters, price: [filters.price[0], Number(e.target.value)] })}
        />
      </div>
    </div>
  );
}
