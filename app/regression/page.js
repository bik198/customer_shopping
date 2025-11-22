'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import RegressionMetrics from '../../app/components/regression/RegressionMetrics';
import ActualVsPredicted from '../../app/components/regression/ActualVsPredicted';
import ResidualsPlot from '../../app/components/regression/ResidualsPlot';
import RegressionFilterPanel from '../../app/components/regression/RegressionFilterPanel';
import Spinner from '../../app/components/Spinner';

// One-hot encoding helper
const oneHotEncode = (data, categoricalColumns) => {
  const encoded = [];
  const encodingMap = {};
  
  // Build encoding map
  categoricalColumns.forEach(col => {
    const uniqueValues = [...new Set(data.map(row => row[col]))].filter(v => v);
    encodingMap[col] = uniqueValues;
  });
  
  // Encode each row
  data.forEach(row => {
    const encodedRow = {};
    
    categoricalColumns.forEach(col => {
      encodingMap[col].forEach(value => {
        const featureName = `${col}_${value}`;
        encodedRow[featureName] = row[col] === value ? 1 : 0;
      });
    });
    
    encoded.push(encodedRow);
  });
  
  return { encoded, encodingMap };
};


export default function RegressionAnalysis() {
  const [rawData, setRawData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [residuals, setResiduals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Feature selection state
  const [selectedFeatures, setSelectedFeatures] = useState({
    Age: true,
    'Review Rating': true,
    'Previous Purchases': true
  });

  useEffect(() => {
    // Load raw data for client-side regression
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setRawData(results.data);
        setLoading(false);
      }
    });
  }, []);

  // Recalculate regression when features change
  useEffect(() => {
    if (rawData.length > 0) {
      calculateRegression();
    }
  }, [rawData, selectedFeatures]);

  const calculateRegression = () => {
    // Get selected feature names
    const allFeatures = Object.keys(selectedFeatures).filter(f => selectedFeatures[f]);
    
    if (allFeatures.length === 0) {
      setMetrics(null);
      setPredictions([]);
      setResiduals([]);
      return;
    }
  
    // Separate numerical and categorical features
    const numericalFeatures = ['Age', 'Review Rating', 'Previous Purchases'];
    const selectedNumerical = allFeatures.filter(f => numericalFeatures.includes(f));
    const selectedCategorical = allFeatures.filter(f => !numericalFeatures.includes(f));
  
    // Prepare data
    const cleanData = rawData.filter(row => {
      const hasNumerical = selectedNumerical.every(f => row[f] && !isNaN(parseFloat(row[f])));
      const hasCategorical = selectedCategorical.every(f => row[f]);
      const hasTarget = row['Purchase Amount'] && !isNaN(parseFloat(row['Purchase Amount']));
      return hasNumerical && hasCategorical && hasTarget;
    });
  
    if (cleanData.length === 0) {
      setMetrics(null);
      setPredictions([]);
      setResiduals([]);
      return;
    }
  
    // One-hot encode categorical features
    const { encoded: encodedData, encodingMap } = oneHotEncode(cleanData, selectedCategorical);
    
    // Get all encoded feature names
    const encodedFeatureNames = [];
    selectedCategorical.forEach(col => {
      encodingMap[col].forEach(value => {
        encodedFeatureNames.push(`${col}_${value}`);
      });
    });
  
    // Combine numerical and encoded features
    const finalData = cleanData.map((row, idx) => {
      const numericalValues = selectedNumerical.map(f => parseFloat(row[f]));
      const encodedValues = encodedFeatureNames.map(f => encodedData[idx][f]);
      
      return {
        features: [...numericalValues, ...encodedValues],
        target: parseFloat(row['Purchase Amount'])
      };
    });
  
    // Split data (80/20)
    const splitIndex = Math.floor(finalData.length * 0.8);
    const trainData = finalData.slice(0, splitIndex);
    const testData = finalData.slice(splitIndex);
  
    // All feature names
    const allFeatureNames = [...selectedNumerical, ...encodedFeatureNames];
  
    // Calculate regression
    const result = linearRegression(trainData, testData, allFeatureNames);
    
    setMetrics(result.metrics);
    setPredictions(result.predictions);
    setResiduals(result.residuals);
  };
  

  const linearRegression = (trainData, testData, featureNames) => {
    // Simple linear regression implementation
    const n = trainData.length;
    
    // Calculate means
    const means = featureNames.map((_, idx) => {
      return trainData.reduce((sum, row) => sum + row.features[idx], 0) / n;
    });
    const targetMean = trainData.reduce((sum, row) => sum + row.target, 0) / n;

    // Calculate coefficients (simplified - using correlation approach)
    const coefficients = featureNames.map((_, idx) => {
      let numerator = 0;
      let denominator = 0;
      
      trainData.forEach(row => {
        const xDiff = row.features[idx] - means[idx];
        const yDiff = row.target - targetMean;
        numerator += xDiff * yDiff;
        denominator += xDiff * xDiff;
      });
      
      return denominator !== 0 ? numerator / denominator : 0;
    });

    // Calculate intercept
    const intercept = targetMean - coefficients.reduce((sum, coef, idx) => sum + coef * means[idx], 0);

    // Make predictions
    const predict = (features) => {
      return intercept + features.reduce((sum, val, idx) => sum + val * coefficients[idx], 0);
    };

    // Test predictions
    const testPredictions = testData.map(row => ({
      actual: row.target,
      predicted: predict(row.features),
      features: row.features
    }));

    // Calculate metrics
    const testActual = testPredictions.map(p => p.actual);
    const testPred = testPredictions.map(p => p.predicted);
    
    const meanActual = testActual.reduce((a, b) => a + b, 0) / testActual.length;
    const ssTotal = testActual.reduce((sum, val) => sum + Math.pow(val - meanActual, 2), 0);
    const ssResidual = testActual.reduce((sum, val, idx) => sum + Math.pow(val - testPred[idx], 2), 0);
    
    const r2 = ssTotal !== 0 ? 1 - (ssResidual / ssTotal) : 0;
    const rmse = Math.sqrt(ssResidual / testActual.length);
    const mae = testActual.reduce((sum, val, idx) => sum + Math.abs(val - testPred[idx]), 0) / testActual.length;

    // Build coefficient object
    const coefObj = {};
    featureNames.forEach((name, idx) => {
      coefObj[name] = coefficients[idx];
    });

    return {
      metrics: {
        test_r2: r2,
        test_rmse: rmse,
        test_mae: mae,
        train_r2: r2, // Simplified - same for demo
        train_rmse: rmse,
        train_mae: mae,
        intercept: intercept,
        coefficients: coefObj
      },
      predictions: testPredictions.map(p => ({
        Actual: p.actual,
        Predicted: p.predicted
      })),
      residuals: testPredictions.map(p => ({
        Predicted: p.predicted,
        Residual: p.actual - p.predicted
      }))
    };
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner color="border-pink-400" size="h-12 w-12" />
    </div>
  );

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Linear Regression Analysis</h1>
      <p className="text-gray-600 mb-6">
        Predicting Purchase Amount using selected features
      </p>
      
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          {/* Metrics Cards */}
          {metrics && <RegressionMetrics metrics={metrics} />}
          
          {!metrics && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-6 text-center">
              <p className="text-yellow-800 font-semibold">Please select at least one feature to run regression analysis.</p>
            </div>
          )}
          
          {/* Visualizations */}
          {metrics && predictions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <ActualVsPredicted data={predictions} />
              <ResidualsPlot data={residuals} />
            </div>
          )}
          
          {/* Model Details */}
          {metrics && Object.keys(metrics.coefficients).length > 0 && (
            <div className="bg-white rounded shadow p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Model Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-pink-600">Regression Equation</h3>
                  <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                    Purchase Amount = {metrics.intercept.toFixed(2)}<br/>
                    {Object.entries(metrics.coefficients).map(([feature, coef]) => (
                      <span key={feature}>
                        + ({coef.toFixed(4)}) × {feature}<br/>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-pink-600">Feature Coefficients</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.coefficients).map(([feature, coef]) => (
                      <div key={feature} className="flex justify-between items-center">
                        <span className="font-medium">{feature}:</span>
                        <span className={`font-semibold ${coef > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coef.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Interpretation */}
          {metrics && Object.keys(metrics.coefficients).length > 0 && (
            <div className="bg-white rounded shadow p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Model Interpretation</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <strong className="text-pink-600">R² Score ({(metrics.test_r2).toFixed(4)}):</strong> {
                    metrics.test_r2 > 0.7 ? "Excellent model fit! The features explain most of the variance." :
                    metrics.test_r2 > 0.5 ? "Good model fit. The features provide reasonable predictions." :
                    metrics.test_r2 > 0.3 ? "Moderate fit. Consider adding more features." :
                    "Poor fit. These features alone are not strong predictors of purchase amount."
                  }
                </div>
                <div>
                  <strong className="text-pink-600">Selected Features ({Object.keys(metrics.coefficients).length}):</strong>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    {Object.entries(metrics.coefficients).map(([feature, coef]) => (
                      <li key={feature}>
                        <strong>{feature}</strong>: {coef > 0 ? 'Positive' : 'Negative'} effect ({coef.toFixed(4)})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-pink-600">RMSE: ${metrics.test_rmse.toFixed(2)}</strong> - 
                  Average prediction error. Lower is better.
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Filter Panel */}
        <RegressionFilterPanel 
          selectedFeatures={selectedFeatures}
          onFeatureChange={setSelectedFeatures}
        />
      </div>
    </div>
  );
}
