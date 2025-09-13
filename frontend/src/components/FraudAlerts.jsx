import React from "react";

const FraudAlerts = ({ alerts }) => (
  <div className="bg-white rounded shadow p-6 mb-8 border border-gray-200">
    <h2 className="text-xl font-semibold mb-4 text-red-500">Recent Fraud Alerts</h2>
    {alerts.length === 0 ? (
      <p className="text-gray-400">No recent fraud alerts.</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {alerts.map((alert, idx) => (
          <li key={idx} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <span className="font-medium text-gray-700">{alert.description}</span>
            <span className="text-sm text-gray-500">{alert.date}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FraudAlerts;
