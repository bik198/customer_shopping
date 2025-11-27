'use client';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import KPICard from './KPICard';
import {
  FaUser, FaMoneyBill, FaChartBar, FaShoppingCart, FaMapMarkerAlt,
  FaPercent, FaStar, FaChartPie
} from 'react-icons/fa';

export default function KPIRow() {
  const [kpis, setKpis] = useState({});

  useEffect(() => {
    Papa.parse("/shopping_behavior_cleaned.csv", {
      download: true,
      header: true,
      complete: ({ data }) => {
        const validRows = data.filter(row => row["Purchase Amount"] && !isNaN(Number(row["Purchase Amount"])));
        const customers = new Set(validRows.map(row => row["Customer ID"])).size || validRows.length;
        const amounts = validRows.map(row => Number(row["Purchase Amount"]));
        const totalRevenue = amounts.reduce((a, b) => a + b, 0);
        const totalTransactions = validRows.length;
        const avgPurchase = amounts.length ? (amounts.reduce((a, b) => a + b, 0) / amounts.length) : 0;
        const medianPurchase = amounts.length
          ? amounts.slice().sort((a, b) => a - b)[Math.floor(amounts.length / 2)]
          : 0;
        const minPurchase = Math.min(...amounts);
        const maxPurchase = Math.max(...amounts);
        const regionCount = new Set(validRows.map(row => row["Location"])).size;
        const subscriptions = validRows.filter(r => String(r["Subscription Status"]).toLowerCase() === "yes").length;
        const discountUtil = validRows.filter(r => String(r["Discount Applied"]).toLowerCase() === "yes").length;
        const reviewRatings = validRows.map(r => Number(r["Review Rating"])).filter(Number.isFinite);
        const avgReview = reviewRatings.length
          ? (reviewRatings.reduce((a, b) => a + b, 0) / reviewRatings.length).toFixed(2)
          : "--";
        const categories = validRows.reduce((acc, row) => {
          acc[row.Category] = (acc[row.Category] || 0) + 1;
          return acc;
        }, {});
        const biggestCat = Object.values(categories).reduce((a, b) => Math.max(a, b), 0);
        const classImbalance = totalTransactions ? ((100 * biggestCat / totalTransactions).toFixed(1) + "%") : "--";
        const uniqueProducts = new Set(validRows.map(r => r["Product Name"] || r["Item Purchased"])).size;
        setKpis({
          customers, totalRevenue, avgPurchase, medianPurchase,
          minPurchase, maxPurchase, totalTransactions,
          regionCount, subscriptions, discountUtil, avgReview,
          classImbalance, uniqueProducts
        });
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <KPICard icon={<FaUser />} label="Total Customers" value={kpis.customers ?? "--"} color="text-blue-500" />
      <KPICard icon={<FaMoneyBill />} isMoney label="Total Revenue" value={kpis.totalRevenue} color="text-green-600" />
      <KPICard icon={<FaMoneyBill />} isMoney label="Avg Purchase" value={kpis.avgPurchase} color="text-green-500" />
      <KPICard icon={<FaChartBar />} isMoney label="Median Purchase" value={kpis.medianPurchase} color="text-yellow-700" />
      <KPICard icon={<FaPercent />} label="Range" value={kpis.minPurchase !== undefined ? `$${kpis.minPurchase}–$${kpis.maxPurchase}` : "--"} color="text-cyan-600" />
      <KPICard icon={<FaShoppingCart />} label="Transactions" value={kpis.totalTransactions ?? "--"} color="text-purple-500" />
      <KPICard icon={<FaMapMarkerAlt />} label="Regions" value={kpis.regionCount ?? "--"} color="text-red-400" />
      <KPICard icon={<FaPercent />} label="Subscription %" value={kpis.subscriptions !== undefined && kpis.customers ? (100 * kpis.subscriptions / kpis.customers).toFixed(1) + "%" : "--"} color="text-green-700" />
      <KPICard icon={<FaPercent />} label="Discount Utilization %" value={kpis.discountUtil !== undefined && kpis.totalTransactions ? (100 * kpis.discountUtil / kpis.totalTransactions).toFixed(1) + "%" : "--"} color="text-indigo-500" />
      <KPICard icon={<FaStar />} label="Avg Review" value={kpis.avgReview ?? "--"} color="text-yellow-500" />
      <KPICard icon={<FaChartPie />} label="Class Imbalance" value={kpis.classImbalance} color="text-pink-500" />
      <KPICard icon={<FaShoppingCart />} label="Unique Products" value={kpis.uniqueProducts} color="text-green-400" />
    </div>
  );
}
