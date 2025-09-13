import React, { useState } from "react";
import { generateTransactionPDF } from "../utils/pdfGenerator";
import { generateHTMLToPDF } from "../utils/htmlToPdf";
import TransactionsPDFView from "./TransactionsPDFView";

const AccountDetails = ({ accountData }) => {
  const [showPDFView, setShowPDFView] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      const result = await generateTransactionPDF(accountData);
      if (!result.success) {
        console.log("jsPDF failed, trying HTML method...");
        await generateHTMLToPDF(accountData);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to print view
      setShowPDFView(true);
    }
  };

  const handleHTMLToPDF = async () => {
    try {
      await generateHTMLToPDF(accountData);
    } catch (error) {
      console.error("Error generating HTML PDF:", error);
      setShowPDFView(true);
    }
  };

  const handlePrintView = () => {
    setShowPDFView(true);
  };

  if (showPDFView) {
    return (
      <TransactionsPDFView 
        accountData={accountData} 
        onClose={() => setShowPDFView(false)} 
      />
    );
  }

  return (
    <div className="bg-white rounded shadow p-6 mb-8 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={handleHTMLToPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Full Report
          </button>
          <button
            onClick={handlePrintView}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print View
          </button>
        </div>
      </div>
      
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <span className="text-gray-500 text-sm">Customer Name</span>
          <p className="text-lg font-semibold text-gray-800">{accountData.customer_name}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <span className="text-gray-500 text-sm">Account Number</span>
          <p className="text-lg font-semibold text-gray-800">{accountData.account_number}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded shadow p-4 text-center border border-blue-200">
          <span className="text-blue-600 text-sm">Total Transactions</span>
          <p className="text-2xl font-bold text-blue-800">{accountData.total_transactions}</p>
        </div>
        <div className="bg-green-50 rounded shadow p-4 text-center border border-green-200">
          <span className="text-green-600 text-sm">Total Balance</span>
          <p className="text-2xl font-bold text-green-800">₹{accountData.total_balance.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 rounded shadow p-4 text-center border border-purple-200">
          <span className="text-purple-600 text-sm">Currency</span>
          <p className="text-2xl font-bold text-purple-800">{accountData.transactions[0]?.currency || 'INR'}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Transaction History</h3>
        <table className="w-full border-collapse shadow bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b-2 border-gray-200 p-3 text-gray-700 text-left">Date</th>
              <th className="border-b-2 border-gray-200 p-3 text-gray-700 text-left">Merchant</th>
              <th className="border-b-2 border-gray-200 p-3 text-gray-700 text-left">Amount</th>
              <th className="border-b-2 border-gray-200 p-3 text-gray-700 text-left">Type</th>
              <th className="border-b-2 border-gray-200 p-3 text-gray-700 text-left">Status</th>
              <th className="border-b-2 border-gray-200 p-3 text-gray-700 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accountData.transactions.map((txn, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border-b border-gray-100 p-3 text-gray-700">
                  {new Date(txn.timestamp).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-100 p-3 text-gray-700">
                  <div>
                    <div className="font-medium">{txn.merchant}</div>
                    <div className="text-sm text-gray-500">{txn.merchant_category} • {txn.location}</div>
                  </div>
                </td>
                <td className="border-b border-gray-100 p-3 text-gray-700">
                  <span className={txn.transaction_type === 'Debit' ? 'text-red-600' : 'text-green-600'}>
                    {txn.transaction_type === 'Debit' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                  </span>
                </td>
                <td className="border-b border-gray-100 p-3 text-gray-700">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {txn.payment_method}
                  </span>
                </td>
                <td className="border-b border-gray-100 p-3 text-gray-700">
                  <span className={`px-2 py-1 rounded text-xs ${
                    txn.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="border-b border-gray-100 p-3 text-gray-700">
                  ₹{txn.balance_after_transaction.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountDetails;