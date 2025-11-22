'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow flex items-center justify-between px-8 py-4">
      <Link href="/" className="font-bold text-2xl">Customer Shopping</Link>
      <div className="flex space-x-8 items-center">
        <Link href="/"><button className="px-4 py-2 rounded hover:bg-gray-100 font-semibold">Home</button></Link>
        <Link href="/salesOverview"><button className="px-4 py-2 rounded hover:bg-blue-100 font-semibold">Sales Overview</button></Link>
        <Link href="/customerDetails"><button className="px-4 py-2 rounded hover:bg-green-100 font-semibold">Customer Details</button></Link>
        <Link href="/productDetails"><button className="px-4 py-2 rounded hover:bg-yellow-100 font-semibold">Product Details</button></Link>
        <Link href="/pcaAnalysis"><button className="px-4 py-2 rounded hover:bg-purple-100 font-semibold">PCA Analysis</button></Link>
        <Link href="/regression"><button className="px-4 py-2 rounded hover:bg-pink-100 font-semibold">Regression</button></Link>
      </div>
    </nav>
  );
}
