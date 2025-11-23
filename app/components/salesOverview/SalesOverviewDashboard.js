'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import SalesByAgeComboChart from './SalesByAgeComboChart';
import SalesFilterPanel from './SalesFilterPanel';
import Top5SalesRow from './Top5SalesRow';
import CategorySalesComboChart from './CategorySalesComboChart';
import PaymentDiscountStackedBar from './PaymentDiscountStackedBar';
import ShippingRadarChart from './ShippingRadarChart';
// import SalesByAgeGroupGenderPieChart from './SalesByAgeGroupGenderPieChart'
import SalesByGenderComposedChart from "./SalesByGenderComposedChart";
import AgeGroupSalesComboChart from './AgeGroupSalesComboChart';
import Spinner from '../Spinner';

export default function SalesOverviewDashboard() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    age: [20, 70],
    purchaseAmount: [0, 1000]
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [top5, setTop5] = useState(null);

  useEffect(() => {
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setRawData(results.data);
        setLoading(false);

        // Calculate Top 5s for the dashboard charts
        const data = results.data;
        const getTop5 = (groupKey) => (
          Object.entries(
            data.reduce((acc, row) => {
              const key = row[groupKey];
              const amt = Number(row["Purchase Amount"]) || Number(row["Purchase Amount (USD)"]) || 0;
              if (!acc[key]) acc[key] = 0;
              acc[key] += amt;
              return acc;
            }, {})
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
        );
        setTop5({
          top5_state: getTop5('Location'),
          top5_shipping: getTop5('Shipping Type'),
          top5_item: getTop5('Item Purchased'),
          top5_payment: getTop5('Payment Method'),
          top5_freq: getTop5('Frequency of Purchases'),
        });
      }
    });
    fetch('/sales_overview_dashboard_data.json')
      .then(res => res.json())
      .then(data => setDashboardData(data));
  }, []);

  if (loading || !dashboardData) return <Spinner color="border-blue-400" />;

  return (
    <div className="flex flex-row gap-8">
      <div className="flex-1 space-y-8">

        {/* Combined Filters + Age Chart Box */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <div className="flex flex-row flex-wrap gap-8 items-start">
            <div className="flex-1 min-w-[350px]">
              <SalesByAgeComboChart rawData={rawData} filters={filters} />
            </div>
            <div className="w-[320px]">
              <SalesFilterPanel filters={filters} onFilterChange={setFilters} />
            </div>
          </div>
        </div>

        {/* Top 5 and the rest of your dashboard below */}
        {top5 && <Top5SalesRow top5={top5} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategorySalesComboChart categoryData={dashboardData.category_sales} />
          <PaymentDiscountStackedBar rawData={rawData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* <SalesByAgeGroupGenderPieChart rawData={rawData} /> */}
          <ShippingRadarChart data={dashboardData.shipping_sales} />
          <AgeGroupSalesComboChart ageData={dashboardData.age_group_sales} />
          <SalesByGenderComposedChart rawData={rawData} />
        </div>

      </div>
    </div>
  );
}
