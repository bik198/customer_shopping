'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-200 shadow flex items-center justify-between px-8 py-4">
      <Link href="/">
        <button
          className={`px-4 py-2 rounded font-semibold cursor-pointer hover:bg-gray-100 hover:text-black ${
            pathname === '/' ? 'bg-blue-500 text-white' : ''
          }`}
        >
          Home
        </button>
      </Link>
      <div className="flex space-x-8 items-center">
        <Link href="/salesOverview">
          <button
            className={`px-4 py-2 rounded font-semibold cursor-pointer hover:bg-blue-100 hover:text-black ${
              pathname === '/salesOverview' ? 'bg-blue-500 text-white' : ''
            }`}
          >
            Sales Overview
          </button>
        </Link>
        <Link href="/pcaAnalysis">
          <button
            className={`px-4 py-2 rounded font-semibold cursor-pointer hover:bg-purple-100 hover:text-black ${
              pathname === '/pcaAnalysis' ? 'bg-purple-500 text-white' : ''
            }`}
          >
            PCA Analysis
          </button>
        </Link>
        <Link href="/regression">
          <button
            className={`px-4 py-2 rounded font-semibold cursor-pointer hover:bg-pink-100 hover:text-black ${
              pathname === '/regression' ? 'bg-pink-500 text-white' : ''
            }`}
          >
            Regression
          </button>
        </Link>
        <Link href="/dataValidation">
          <button
            className={`px-4 py-2 rounded font-semibold cursor-pointer hover:bg-pink-100 hover:text-black ${
              pathname === '/dataValidation' ? 'bg-pink-500 text-white' : ''
            }`}
          >
            Data Validation
          </button>
        </Link>
      </div>
    </nav>
  );
}
