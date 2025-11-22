'use client';
import AgeHistogram from '../app/components/AgeHistogram';
import PurchaseAmountScatter from '../app/components/PurchaseAmountScatter';

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Dashboard</h1>
      <AgeHistogram />
      <PurchaseAmountScatter />
    </main>
  );
}
