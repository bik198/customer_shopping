'use client';

export default function RegressionMetrics({ metrics }) {
  const metricCards = [
    { 
      label: 'Test R² Score', 
      value: metrics.test_r2.toFixed(4), 
      description: 'Variance explained',
      color: 'bg-pink-500',
      interpretation: metrics.test_r2 > 0.7 ? 'Excellent' : metrics.test_r2 > 0.5 ? 'Good' : 'Poor'
    },
    { 
      label: 'Test RMSE', 
      value: `$${metrics.test_rmse.toFixed(2)}`, 
      description: 'Average prediction error',
      color: 'bg-rose-500'
    },
    { 
      label: 'Test MAE', 
      value: `$${metrics.test_mae.toFixed(2)}`, 
      description: 'Mean absolute error',
      color: 'bg-red-500'
    },
    { 
      label: 'Train R² Score', 
      value: metrics.train_r2.toFixed(4), 
      description: 'Training performance',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, idx) => (
        <div key={idx} className="bg-white rounded shadow p-6 hover:shadow-lg transition">
          <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-3 ${metric.color}`}>
            {metric.label}
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
          <div className="text-sm text-gray-600">{metric.description}</div>
          {metric.interpretation && (
            <div className={`text-xs mt-2 font-semibold ${
              metric.interpretation === 'Excellent' ? 'text-green-600' : 
              metric.interpretation === 'Good' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metric.interpretation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
