import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Mon", fraud: 12 },
  { date: "Tue", fraud: 18 },
  { date: "Wed", fraud: 9 },
  { date: "Thu", fraud: 22 },
  { date: "Fri", fraud: 31 },
  { date: "Sat", fraud: 40 },
  { date: "Sun", fraud: 25 },
];

const FraudTrendsLineChart = () => (
  <div className="bg-white rounded shadow p-6 border border-gray-200 flex flex-col items-center">
    <div className="text-lg font-semibold mb-2 text-gray-800">Fraud Trends Over Time</div>
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default FraudTrendsLineChart;
