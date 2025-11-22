'use client';

export default function Spinner({ color = "border-blue-400", size = "h-8 w-8" }) {
  return (
    <div className="flex items-center justify-center h-[300px]">
      <div
        className={`animate-spin rounded-full ${size} border-4 ${color} border-t-transparent`}
      />
    </div>
  );
}
