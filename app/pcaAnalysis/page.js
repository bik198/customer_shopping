'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import PCAScatterPlot from '../../app/components/pcaAnalysis/PCAScatterPlot';
import PCAMetrics from '../../app/components/pcaAnalysis/PCAMetrics';
import PCAFilterPanel from '../../app/components/pcaAnalysis/PCAFilterPanel';
import Spinner from '../../app/components/Spinner';

export default function PCAAnalysis() {
  const [pcaData, setPcaData] = useState([]);
  const [varianceData, setVarianceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPCs, setSelectedPCs] = useState({ x: 'PC1', y: 'PC2' });
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    Papa.parse("/pca_extended_data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setPcaData(results.data);
        
        Papa.parse("/pca_variance_explained.csv", {
          download: true,
          header: true,
          complete: (varianceResults) => {
            setVarianceData(varianceResults.data);
            setLoading(false);
          }
        });
      }
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner color="border-purple-400" size="h-12 w-12" />
    </div>
  );

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Principal Component Analysis (PCA)</h1>
      
      <PCAMetrics varianceData={varianceData} />
      
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex-1">
          <PCAScatterPlot 
            data={pcaData} 
            selectedPCs={selectedPCs}
            varianceData={varianceData}
            categoryFilter={categoryFilter}
          />
        </div>
        <PCAFilterPanel 
          selectedPCs={selectedPCs} 
          onPCChange={setSelectedPCs}
          varianceData={varianceData}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </div>
      
      <div className="bg-white rounded shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Why Does PCA Look Clustered?</h2>
        <div className="space-y-4 text-gray-700">
          <p><strong className="text-purple-600">Low Variance in First 2 PCs:</strong> PC1 and PC2 only capture 18.4% of total variance. This means most variation is in higher dimensions. Furthermore, the first 30 PC's explain only about 78% of total variance.</p>
          <p><strong className="text-purple-600">Similar Customer Behavior:</strong> Most customers have similar shopping patterns (age ranges, purchase amounts, preferences), creating natural overlap.</p>
          <p><strong className="text-purple-600">Many Categorical Features:</strong> 13 categorical variables create high-dimensional sparse data that's hard to separate in 2D.</p>
          <p><strong className="text-purple-600">Recommendation:</strong> Try viewing different PC combinations (especially PC3-PC5) and use category filters to see patterns within specific product groups.</p>
        </div>
      </div>
    </div>
  );
}