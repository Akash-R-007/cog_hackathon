import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { category: "Online Shopping", fraud: 120 },
  { category: "Travel", fraud: 90 },
  { category: "Electronics", fraud: 70 },
  { category: "Food Delivery", fraud: 55 },
  { category: "Gaming", fraud: 40 },
];

const HighRiskMerchantBar = () => (
  <div className="bg-white rounded shadow p-6 border border-gray-200 flex flex-col items-center">
    <div className="text-lg font-semibold mb-2 text-gray-800">High-Risk Merchant Categories</div>
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="fraud" fill="#ef4444" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default HighRiskMerchantBar;
