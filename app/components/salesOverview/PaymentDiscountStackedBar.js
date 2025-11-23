'use client';
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

// Builds 100% stacked bars for proportions
function buildStackedData(rawData) {
  // Group by Payment + Discount
  const totals = {};
  rawData.forEach(row => {
    const payment = row['Payment Method'];
    const discount = row['Discount Applied'];
    const amt = Number(row["Purchase Amount"]) || Number(row["Purchase Amount (USD)"]) || 0;
    if (!payment || !discount) return;
    if (!totals[payment]) totals[payment] = { payment, "Used Discount": 0, "No Discount": 0 };
    if (discount === "Yes") totals[payment]["Used Discount"] += amt;
    if (discount === "No") totals[payment]["No Discount"] += amt;
  });
  // Convert to percent-of-total
  return Object.values(totals)
    .map(obj => {
      const total = obj["Used Discount"] + obj["No Discount"];
      return {
        payment: obj.payment.length > 16 ? obj.payment.slice(0, 15) + '…' : obj.payment,
        "Used Discount": total === 0 ? 0 : Math.round((obj["Used Discount"] / total) * 100),
        "No Discount": total === 0 ? 0 : Math.round((obj["No Discount"] / total) * 100)
      };
    });
}

export default function PaymentDiscount100StackedBar({ rawData }) {
  const data = useMemo(() => buildStackedData(rawData), [rawData]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-lg mb-2">
        Sales by Payment Method: % Using Discount
      </h3>
      <ResponsiveContainer width="100%" height={330}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 50, right: 16, top: 16, bottom: 16 }}
          stackOffset="expand"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 1]} tickFormatter={v => Math.round(v * 100) + '%'} />
          <YAxis dataKey="payment" type="category" interval={0} width={110} />
          <Tooltip formatter={val => `${val}%`} />
          <Legend />
          <Bar dataKey="Used Discount" stackId="a" fill="#34d399">
            <LabelList dataKey="Used Discount" position="insideRight" formatter={val => val > 0 ? `${val}%` : null} fill="#fff" />
          </Bar>
          <Bar dataKey="No Discount" stackId="a" fill="#fbbf24">
            <LabelList dataKey="No Discount" position="insideLeft" formatter={val => val > 0 ? `${val}%` : null} fill="#fff" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
