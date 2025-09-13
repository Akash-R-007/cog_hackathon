import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Safe", value: 24500 },
  { name: "Fraud", value: 300 },
];
const COLORS = ["#22c55e", "#ef4444"];

const FraudVsNonFraudPie = () => (
  <div className="bg-white rounded shadow p-6 border border-gray-200 flex flex-col items-center">
    <div className="text-lg font-semibold mb-2 text-gray-800">Fraud vs Non-Fraud Distribution</div>
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default FraudVsNonFraudPie;
