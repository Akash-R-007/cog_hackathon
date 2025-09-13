import React from "react";

const TopRiskCustomersTable = () => (
  <div className="bg-white rounded shadow p-6 border border-gray-200">
    <div className="text-lg font-semibold mb-4 text-gray-800">Top 10 High-Risk Customers</div>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Account #</th>
          <th className="p-2 text-center">Fraud Attempts</th>
          <th className="p-2 text-center">Risk Score</th>
          <th className="p-2 text-center">Last Location</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(10)].map((_, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="p-2 font-mono">****{1234 + i}</td>
            <td className="p-2 text-center">{Math.floor(Math.random() * 10) + 1}</td>
            <td className="p-2 text-center text-red-600 font-bold">{(Math.random() * 100).toFixed(1)}%</td>
            <td className="p-2 text-center">{["Mumbai","Delhi","Chennai","Bangalore","Kolkata"][i%5]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TopRiskCustomersTable;
