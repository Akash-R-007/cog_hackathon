import React, { useState } from "react";
import DashboardSummary from "../components/DashboardSummary";
import FraudAlerts from "../components/FraudAlerts";
import TransactionTable from "../components/TransactionTable";
import AccountDetails from "../components/AccountDetails";

const Transactions = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fraudResult, setFraudResult] = useState(null);

  const fetchDetails = async () => {
    if (!accountNumber || accountNumber.length < 15 || accountNumber.length > 16) {
      setError("Please enter a valid 15-16 digit account number");
      return;
    }

    setLoading(true);
    setError(null);
    setFraudResult(null);
    setAccountData(null);

    try {
      const response = await fetch(`http://localhost:5000/api/accounts/${accountNumber}`);
      
      if (!response.ok) {
        throw new Error("Account not found");
      }

      const data = await response.json();
      setAccountData(data);

      // Fraud detection logic
      const frauds = (data.transactions || []).filter(txn => 
        txn.amount > 50000 || // Large transactions
        (txn.transaction_type === 'Debit' && txn.amount > 25000) // Large debits
      );

      setFraudResult(frauds.length > 0 ? "Fraudulent Activity Detected!" : "No Fraud Detected");
    } catch (err) {
      setError(err.message);
      setAccountData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Fraud Checker</h1>
        
        {/* Account Number Input */}
        <div className="bg-white rounded shadow p-6 mb-8 border border-gray-200">
          <input
            type="text"
            placeholder="Enter Account Number (15-16 digits)"
            className="border border-gray-300 bg-white text-gray-800 placeholder-gray-400 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm mb-4"
            value={accountNumber}
            maxLength={16}
            minLength={15}
            pattern="[0-9]{15,16}"
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setAccountNumber(val);
            }}
          />
          <button
            onClick={fetchDetails}
            className="bg-blue-600 text-white px-6 py-3 rounded font-semibold shadow hover:bg-blue-700 transition w-full"
            disabled={accountNumber.length < 15 || accountNumber.length > 16}
          >
            Check Account for Fraud
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-blue-600 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Getting account details...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Fraud Result */}
        {fraudResult && !loading && (
          <div className={`text-center text-lg font-bold mb-8 p-4 rounded shadow ${
            fraudResult.includes("Fraudulent") 
              ? "bg-red-50 text-red-800 border border-red-200" 
              : "bg-green-50 text-green-800 border border-green-200"
          }`}>
            {fraudResult}
          </div>
        )}

        {/* Account Details */}
        {!loading && accountData && (
          <AccountDetails accountData={accountData} />
        )}
      </div>
    </div>
  );
};

export default Transactions;
