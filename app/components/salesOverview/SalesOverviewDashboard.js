'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import SalesByAgeComboChart from './SalesByAgeComboChart';
import SalesFilterPanel from './SalesFilterPanel';
import Top5SalesRow from './Top5SalesRow';
import CategorySalesComboChart from './CategorySalesComboChart';
import PaymentDiscountStackedBar from './PaymentDiscountStackedBar';
import ShippingRadarChart from './ShippingRadarChart';
import AgeGroupSalesComboChart from './AgeGroupSalesComboChart';
import PrevPurchaseFreqAreaChart from './PrevPurchaseFreqAreaChart';
import Spinner from '../Spinner';
import dynamic from 'next/dynamic';

// NEW: Customer details row imports (from salesOverview folder)
import CustomerGenderPie from './CustomerGenderPie';
// import CustomerLocationMap from './CustomerLocationMap';
import CustomerFilterPanel from './CustomerFilterPanel';
// Dynamic import disables SSR for this component
const CustomerLocationMap = dynamic(
  () => import('./CustomerLocationMap'),
  { ssr: false }
);

export default function SalesOverviewDashboard() {
  const stateCoordinates = {
    "Alabama": [32.806671, -86.791130],
    "Alaska": [61.370716, -152.404419],
    "Arizona": [33.729759, -111.431221],
    "Arkansas": [34.969704, -92.373123],
    "California": [36.116203, -119.681564],
    "Colorado": [39.059811, -105.311104],
    "Connecticut": [41.597782, -72.755371],
    "Delaware": [39.318523, -75.507141],
    "Florida": [27.766279, -81.686783],
    "Georgia": [33.040619, -83.643074],
    "Hawaii": [21.094318, -157.498337],
    "Idaho": [44.240459, -114.478828],
    "Illinois": [40.349457, -88.986137],
    "Indiana": [39.849426, -86.258278],
    "Iowa": [42.011539, -93.210526],
    "Kansas": [38.526600, -96.726486],
    "Kentucky": [37.668140, -84.670067],
    "Louisiana": [31.169546, -91.867805],
    "Maine": [44.693947, -69.381927],
    "Maryland": [39.063946, -76.802101],
    "Massachusetts": [42.230171, -71.530106],
    "Michigan": [43.326618, -84.536095],
    "Minnesota": [45.694454, -93.900192],
    "Mississippi": [32.741646, -89.678696],
    "Missouri": [38.456085, -92.288368],
    "Montana": [46.921925, -110.454353],
    "Nebraska": [41.125370, -98.268082],
    "Nevada": [38.313515, -117.055374],
    "New Hampshire": [43.452492, -71.563896],
    "New Jersey": [40.298904, -74.521011],
    "New Mexico": [34.840515, -106.248482],
    "New York": [42.165726, -74.948051],
    "North Carolina": [35.630066, -79.806419],
    "North Dakota": [47.528912, -99.784012],
    "Ohio": [40.388783, -82.764915],
    "Oklahoma": [35.565342, -96.928917],
    "Oregon": [44.572021, -122.070938],
    "Pennsylvania": [40.590752, -77.209755],
    "Rhode Island": [41.680893, -71.511780],
    "South Carolina": [33.856892, -80.945007],
    "South Dakota": [44.299782, -99.438828],
    "Tennessee": [35.747845, -86.692345],
    "Texas": [31.054487, -97.563461],
    "Utah": [40.150032, -111.862434],
    "Vermont": [44.045876, -72.710686],
    "Virginia": [37.769337, -78.169968],
    "Washington": [47.400902, -121.490494],
    "West Virginia": [38.491226, -80.954453],
    "Wisconsin": [44.268543, -89.616508],
    "Wyoming": [42.755966, -107.302490]
  };
  const stateList = ["All", ...Object.keys(stateCoordinates)]
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    age: [20, 70],
    purchaseAmount: [0, 1000]
  });
  const [customerFilters, setCustomerFilters] = useState({
    region: "All",
    gender: "All",
    age: [20, 70]
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
        <div className="grid w-full gap-8 items-start" style={{ gridTemplateColumns: "1fr 320px" }}>
            <SalesByAgeComboChart rawData={rawData} filters={filters} />
          <div style={{ width: "320px", minWidth: "320px", maxWidth: "320px" }}>
            <SalesFilterPanel filters={filters} onFilterChange={setFilters} />
          </div>
        </div>


        {/* Customer Details Row */}
        <div className="grid gap-8 mb-8 w-full" style={{ gridTemplateColumns: "1.5fr 3fr 320px" }}>
          <div className="bg-white rounded shadow p-6 h-full">
            <CustomerGenderPie rawData={rawData || []} filters={customerFilters} />
          </div>
          <div className="bg-white rounded shadow p-6 h-full">
            <CustomerLocationMap rawData={rawData} filters={customerFilters} stateCoordinates={stateCoordinates} />
          </div>
          <div className="bg-white rounded shadow p-6 h-full" style={{ width: "320px", minWidth: 320, maxWidth: 320 }}>
            <CustomerFilterPanel filters={customerFilters} onFilterChange={setCustomerFilters} states={stateList}/>
          </div>
        </div>

        {/* Top 5 and main dashboard sections */}
        {top5 && <Top5SalesRow top5={top5} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategorySalesComboChart categoryData={dashboardData.category_sales} />
          <PaymentDiscountStackedBar rawData={rawData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ShippingRadarChart data={dashboardData.shipping_sales} />
          <AgeGroupSalesComboChart ageData={dashboardData.age_group_sales} />
          <PrevPurchaseFreqAreaChart rawData={rawData} />
        </div>

      </div>
    </div>
  );
}
