import React from "react";

const DashboardKPI = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {/* Total Transactions Today */}
    <div className="bg-white rounded shadow p-6 flex items-center gap-4 border border-gray-200">
      <div className="bg-blue-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 10h18M3 6h18M3 14h18M3 18h18" /></svg>
      </div>
      <div>
        <div className="text-gray-500 text-xs">Total Transactions Today</div>
        <div className="text-2xl font-bold text-gray-800">25,430 <span className="text-green-500 text-base ml-1">▲</span></div>
      </div>
    </div>
    {/* Fraudulent Transactions Detected */}
    <div className="bg-white rounded shadow p-6 flex items-center gap-4 border border-gray-200">
      <div className="bg-red-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
      </div>
      <div>
        <div className="text-gray-500 text-xs">Fraudulent Transactions</div>
        <div className="text-2xl font-bold text-gray-800">312 <span className="text-red-500 text-base ml-1">▼</span></div>
      </div>
    </div>
    {/* Fraud Percentage */}
    <div className="bg-white rounded shadow p-6 flex items-center gap-4 border border-gray-200">
      <div className="bg-yellow-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
      </div>
      <div>
        <div className="text-gray-500 text-xs">Fraud Percentage</div>
        <div className="text-2xl font-bold text-gray-800">1.2%</div>
      </div>
    </div>
    {/* Total Money Lost Prevented */}
    <div className="bg-white rounded shadow p-6 flex items-center gap-4 border border-gray-200">
      <div className="bg-green-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>
      </div>
      <div>
        <div className="text-gray-500 text-xs">Money Lost Prevented</div>
        <div className="text-2xl font-bold text-gray-800">₹12.5 Cr</div>
      </div>
    </div>
  </div>
);

export default DashboardKPI;
