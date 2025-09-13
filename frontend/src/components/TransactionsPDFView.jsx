import React from "react";

const TransactionsPDFView = ({ accountData, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const fraudulentTransactions = accountData.transactions.filter(txn => 
    txn.amount > 50000 || (txn.transaction_type === 'Debit' && txn.amount > 25000)
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto print:relative print:inset-auto print:bg-transparent">
      {/* Header for screen view only */}
      <div className="print:hidden bg-gray-100 p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Print Preview</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Print/Save as PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bank Transaction Report</h1>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Account Information */}
        <div className="bg-gray-50 p-6 rounded mb-8 print:bg-transparent print:border print:border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Account Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Customer Name:</strong> {accountData.customer_name}
            </div>
            <div>
              <strong>Account Number:</strong> {accountData.account_number}
            </div>
            <div>
              <strong>Total Transactions:</strong> {accountData.total_transactions}
            </div>
            <div>
              <strong>Total Balance:</strong> ₹{accountData.total_balance?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="mb-8 print:break-inside-avoid">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h2>
          <div className="w-full">
            <table className="w-full border-collapse border border-gray-300 text-xs print:text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-semibold">#</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Date</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Merchant</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Category</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Type</th>
                  <th className="border border-gray-300 p-2 text-right font-semibold">Amount</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Method</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Status</th>
                  <th className="border border-gray-300 p-2 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {accountData.transactions.map((txn, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} print:break-inside-avoid`}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(txn.timestamp).toLocaleDateString('en-IN')}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="break-words">
                        {txn.merchant}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">{txn.merchant_category}</td>
                    <td className="border border-gray-300 p-2">{txn.transaction_type}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      <span className={txn.transaction_type === 'Debit' ? 'text-red-600' : 'text-green-600'}>
                        {txn.transaction_type === 'Debit' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">{txn.payment_method}</td>
                    <td className="border border-gray-300 p-2">
                      <span className={`px-1 py-0.5 rounded text-xs ${
                        txn.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      ₹{txn.balance_after_transaction.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fraud Detection Summary */}
        <div className="bg-gray-50 p-6 rounded print:bg-transparent print:border print:border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Fraud Detection Summary</h2>
          {fraudulentTransactions.length > 0 ? (
            <div>
              <p className="text-red-600 font-semibold mb-4">
                ⚠️ {fraudulentTransactions.length} potentially fraudulent transaction(s) detected
              </p>
              <ul className="list-disc list-inside space-y-2">
                {fraudulentTransactions.map((txn, index) => (
                  <li key={index} className="text-sm text-red-700">
                    ₹{txn.amount.toLocaleString()} at {txn.merchant} on {new Date(txn.timestamp).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-green-600 font-semibold">✓ No fraudulent activity detected</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-500 text-center">
          <p>Generated by Bank Fraud Detection System</p>
          <p>Report generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPDFView;