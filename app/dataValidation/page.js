'use client';
import DataValidationSummary from '../components/dataValidation/DataValidationSummary';

export default function DataValidationPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Data Validation: Synthetic Data Evidence</h1>
      <DataValidationSummary />
    </div>
  );
}
