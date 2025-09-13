import React, { useState, useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import DashboardSummary from "../components/DashboardSummary";
import FraudAlerts from "../components/FraudAlerts";

const mockFraudAlerts = [
  { description: "Suspicious login from new device", date: "2025-09-10" },
  { description: "Unusual transaction: $2,000 at Electronics Store", date: "2025-09-09" },
];

const Dashboard = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fraudAlerts, setFraudAlerts] = useState(mockFraudAlerts);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/account/${accountNumber}`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error fetching:", err);
    }
    setLoading(false);
  };

  // Calculate summary
  const totalTransactions = transactions.length;
  const totalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-5xl p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Account Transactions</h1>
        <DashboardSummary
          totalTransactions={totalTransactions}
          totalBalance={totalBalance}
          fraudAlerts={fraudAlerts}
        />
        <FraudAlerts alerts={fraudAlerts} />
        <div className="mb-8">
          <input
            type="text"
            placeholder="Enter Account Number"
            className="border border-gray-300 bg-white text-gray-800 placeholder-gray-400 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm mb-4"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition w-full"
          >
            Fetch
          </button>
        </div>
        {loading && <p className="text-center text-blue-600">Loading...</p>}
        {transactions.length > 0 && !loading && (
          <>
            <TransactionTable transactions={transactions} />
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition"
                onClick={() => window.print()}
              >
                Download PDF
              </button>
            </div>
          </>
        )}
        {!loading && transactions.length === 0 && (
          <p className="text-gray-400 text-center">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
