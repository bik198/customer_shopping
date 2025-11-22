'use client';

export default function RegressionFilterPanel({ selectedFeatures, onFeatureChange }) {
  const availableFeatures = [
    // Numerical Features
    { name: 'Age', description: 'Customer age', type: 'numerical' },
    { name: 'Review Rating', description: 'Product review score', type: 'numerical' },
    { name: 'Previous Purchases', description: 'Number of past orders', type: 'numerical' },
    
    // Categorical Features
    { name: 'Gender', description: 'Customer gender', type: 'categorical' },
    { name: 'Category', description: 'Product category', type: 'categorical' },
    { name: 'Location', description: 'Customer state', type: 'categorical' },
    { name: 'Size', description: 'Product size', type: 'categorical' },
    { name: 'Season', description: 'Purchase season', type: 'categorical' },
    { name: 'Subscription Status', description: 'Has subscription?', type: 'categorical' },
    { name: 'Shipping Type', description: 'Delivery method', type: 'categorical' },
    { name: 'Discount Applied', description: 'Discount used?', type: 'categorical' },
    { name: 'Promo Code Used', description: 'Promo code applied?', type: 'categorical' },
    { name: 'Payment Method', description: 'Payment type', type: 'categorical' },
    { name: 'Frequency of Purchases', description: 'Purchase frequency', type: 'categorical' }
  ];

  const handleToggle = (featureName) => {
    onFeatureChange({
      ...selectedFeatures,
      [featureName]: !selectedFeatures[featureName]
    });
  };

  const selectAll = () => {
    const allSelected = {};
    availableFeatures.forEach(f => allSelected[f.name] = true);
    onFeatureChange(allSelected);
  };

  const clearAll = () => {
    const allDeselected = {};
    availableFeatures.forEach(f => allDeselected[f.name] = false);
    onFeatureChange(allDeselected);
  };

  const selectNumerical = () => {
    const numericalSelected = {};
    availableFeatures.forEach(f => {
      numericalSelected[f.name] = f.type === 'numerical';
    });
    onFeatureChange(numericalSelected);
  };

  const selectCategorical = () => {
    const categoricalSelected = {};
    availableFeatures.forEach(f => {
      categoricalSelected[f.name] = f.type === 'categorical';
    });
    onFeatureChange(categoricalSelected);
  };

  const selectedCount = Object.values(selectedFeatures).filter(Boolean).length;
  const numericalFeatures = availableFeatures.filter(f => f.type === 'numerical');
  const categoricalFeatures = availableFeatures.filter(f => f.type === 'categorical');

  return (
    <div className="bg-white shadow rounded p-6 w-80 flex-shrink-0 sticky top-24 h-fit overflow-y-auto max-h-[calc(100vh-120px)]">
      <h3 className="font-bold text-xl mb-2">Feature Selection</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select features to include in the regression model
      </p>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={selectAll}
          className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-2 rounded text-xs font-medium transition"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-2 rounded text-xs font-medium transition"
        >
          Clear All
        </button>
        <button
          onClick={selectNumerical}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-2 rounded text-xs font-medium transition"
        >
          Numerical Only
        </button>
        <button
          onClick={selectCategorical}
          className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-2 rounded text-xs font-medium transition"
        >
          Categorical Only
        </button>
      </div>

      {/* Numerical Features */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-blue-700 mb-2">Numerical Features</h4>
        <div className="space-y-2">
          {numericalFeatures.map(feature => (
            <label 
              key={feature.name}
              className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="checkbox"
                checked={selectedFeatures[feature.name] || false}
                onChange={() => handleToggle(feature.name)}
                className="mt-1 mr-2 h-4 w-4 text-pink-600 rounded focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">{feature.name}</div>
                <div className="text-xs text-gray-600">{feature.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Categorical Features */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-purple-700 mb-2">Categorical Features</h4>
        <div className="space-y-2">
          {categoricalFeatures.map(feature => (
            <label 
              key={feature.name}
              className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="checkbox"
                checked={selectedFeatures[feature.name] || false}
                onChange={() => handleToggle(feature.name)}
                className="mt-1 mr-2 h-4 w-4 text-pink-600 rounded focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">{feature.name}</div>
                <div className="text-xs text-gray-600">{feature.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Selected Count */}
      <div className={`p-3 rounded border ${
        selectedCount === 0 
          ? 'bg-red-50 border-red-200' 
          : 'bg-pink-50 border-pink-200'
      }`}>
        <div className="text-sm">
          <strong className={selectedCount === 0 ? 'text-red-700' : 'text-pink-700'}>
            {selectedCount} feature{selectedCount !== 1 ? 's' : ''} selected
          </strong>
        </div>
        {selectedCount === 0 && (
          <p className="text-xs text-red-600 mt-1">
            Select at least one feature to run regression
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-gray-700">
        <strong className="text-blue-800">Note:</strong> Categorical features are automatically encoded using one-hot encoding for regression analysis.
      </div>
    </div>
  );
}
