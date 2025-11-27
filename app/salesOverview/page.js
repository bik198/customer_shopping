'use client';

import SalesOverviewDashboard from '../../app/components/salesOverview/SalesOverviewDashboard';
import KPIRow from '../../app/components/salesOverview/KPIRow';

export default function SalesOverview() {
  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Sales Overview Dashboard</h1>
      <div className="w-full flex flex-row gap-8 justify-center mb-8">
        <KPIRow />
      </div>
      <SalesOverviewDashboard />
    </div>
  );
}
