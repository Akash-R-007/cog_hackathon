import React from "react";

const CaseManagementPanel = () => (
  <div className="bg-white rounded shadow p-6 border border-gray-200">
    <div className="text-lg font-semibold mb-4 text-gray-800">Case Management Panel</div>
    <div className="text-gray-500 text-sm mb-2">(Demo Only)</div>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Transaction</th>
          <th className="p-2 text-center">Status</th>
          <th className="p-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="p-2">TXN{1000 + i}</td>
            <td className="p-2 text-center text-yellow-600 font-bold">Review</td>
            <td className="p-2 text-center">
              <button className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-2">Mark Safe</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">Escalate</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CaseManagementPanel;
