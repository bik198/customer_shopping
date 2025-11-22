'use client';

export default function PCAMetrics({ varianceData }) {
  if (!varianceData || varianceData.length === 0) return null;

  const pc1Var = (parseFloat(varianceData[0]?.Variance || 0) * 100).toFixed(2);
  const pc2Var = (parseFloat(varianceData[1]?.Variance || 0) * 100).toFixed(2);
  const first5Cumulative = (parseFloat(varianceData[4]?.Cumulative || 0) * 100).toFixed(2);

  const metrics = [
    { label: 'PC1 Variance', value: `${pc1Var}%`, description: 'Customer spending + demographics', color: 'bg-purple-500' },
    { label: 'PC2 Variance', value: `${pc2Var}%`, description: 'Purchase frequency + seasonal', color: 'bg-indigo-500' },
    { label: 'First 5 PCs', value: `${first5Cumulative}%`, description: 'Total variance explained', color: 'bg-blue-500' },
    { label: 'Components for 90%', value: '66', description: 'Due to categorical features', color: 'bg-teal-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white rounded shadow p-6 hover:shadow-lg transition">
          <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-3 ${metric.color}`}>
            {metric.label}
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
          <div className="text-sm text-gray-600">{metric.description}</div>
        </div>
      ))}
    </div>
  );
}
