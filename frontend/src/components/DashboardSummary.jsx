import React from "react";

const DashboardSummary = ({ totalTransactions, totalBalance, fraudAlerts }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded shadow p-6 flex flex-col items-center border border-gray-200 text-gray-700">
      <span className="text-gray-500">Total Transactions</span>
      <span className="text-2xl font-bold">{totalTransactions}</span>
    </div>
    <div className="bg-white rounded shadow p-6 flex flex-col items-center border border-gray-200 text-gray-700">
      <span className="text-gray-500">Total Balance</span>
      <span className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</span>
    </div>
    <div className="bg-white rounded shadow p-6 flex flex-col items-center border border-gray-200 text-gray-700">
      <span className="text-gray-500">Fraud Alerts</span>
      <span className="text-2xl font-bold text-red-500">{fraudAlerts}</span>
    </div>
  </div>
);

export default DashboardSummary;
