'use client';

export default function PCAFilterPanel({ selectedPCs, onPCChange, varianceData, categoryFilter, onCategoryChange }) {
  const pcOptions = ['PC1', 'PC2', 'PC3', 'PC4', 'PC5'];
  
  const getVariance = (pc) => {
    const variance = varianceData.find(v => v.Component === pc);
    return variance ? (parseFloat(variance.Variance) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="bg-white shadow rounded p-6 w-72 flex-shrink-0 sticky top-24 h-fit">
      <h3 className="font-bold text-xl mb-6">Component Selection</h3>
      
      {/* Category Filter - NEW */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Category Filter:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" 
          value={categoryFilter}
          onChange={e => onCategoryChange(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      
      {/* X-Axis Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">X-Axis Component:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" 
          value={selectedPCs.x}
          onChange={e => onPCChange({ ...selectedPCs, x: e.target.value })}
        >
          {pcOptions.map(pc => (
            <option key={pc} value={pc}>
              {pc} ({getVariance(pc)}%)
            </option>
          ))}
        </select>
      </div>
      
      {/* Y-Axis Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Y-Axis Component:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" 
          value={selectedPCs.y}
          onChange={e => onPCChange({ ...selectedPCs, y: e.target.value })}
        >
          {pcOptions.map(pc => (
            <option key={pc} value={pc}>
              {pc} ({getVariance(pc)}%)
            </option>
          ))}
        </select>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Quick Presets:</label>
        <div className="space-y-2">
          <button 
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded text-sm font-medium transition"
            onClick={() => onPCChange({ x: 'PC1', y: 'PC2' })}
          >
            PC1 vs PC2 (Default)
          </button>
          <button 
            className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-2 rounded text-sm font-medium transition"
            onClick={() => onPCChange({ x: 'PC1', y: 'PC3' })}
          >
            PC1 vs PC3
          </button>
          <button 
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded text-sm font-medium transition"
            onClick={() => onPCChange({ x: 'PC3', y: 'PC4' })}
          >
            PC3 vs PC4
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded p-4 text-sm text-gray-700">
        <strong className="text-purple-800">Note:</strong> This data naturally clusters due to similar shopping patterns. Try different PC combinations and category filters for better insights.
      </div>
    </div>
  );
}
