'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-8 text-center">Customer Shopping Behavior</h1>
      <button
        onClick={() => router.push('/salesOverview')}
        className="bg-blue-500 text-white px-8 py-3 rounded font-semibold text-lg hover:bg-blue-600 transition"
      >
        Enter
      </button>
    </section>
  );
}
