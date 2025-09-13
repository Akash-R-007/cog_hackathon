import React from "react";

const TransactionTable = ({ transactions }) => {
  return (
    <table className="w-full border-collapse shadow mt-4 bg-white rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100">
          <th className="border-b-2 border-gray-200 p-2 text-gray-700 text-left">Date</th>
          <th className="border-b-2 border-gray-200 p-2 text-gray-700 text-left">Description</th>
          <th className="border-b-2 border-gray-200 p-2 text-gray-700 text-left">Amount</th>
          <th className="border-b-2 border-gray-200 p-2 text-gray-700 text-left">Type</th>
          <th className="border-b-2 border-gray-200 p-2 text-gray-700 text-left">Balance</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((txn, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="border-b border-gray-100 p-2 text-gray-700">{txn.date}</td>
            <td className="border-b border-gray-100 p-2 text-gray-700">{txn.description}</td>
            <td className="border-b border-gray-100 p-2 text-gray-700">{txn.amount}</td>
            <td className="border-b border-gray-100 p-2 text-gray-700">{txn.type}</td>
            <td className="border-b border-gray-100 p-2 text-gray-700">{txn.balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
