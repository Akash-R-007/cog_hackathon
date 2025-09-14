import React, { useState, useEffect, useRef } from "react";
import DashboardSummary from "../components/DashboardSummary";
import TransactionTable from "../components/TransactionTable";


// Start with empty or mock alerts
const mockFraudAlerts = [];


const Dashboard = () => {
  const [fraudAlerts, setFraudAlerts] = useState(mockFraudAlerts);
  const [notification, setNotification] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [highlightedIdx, setHighlightedIdx] = useState(null);
  const [summary, setSummary] = useState({ totalTransactions: 0, totalBalance: 0, fraudAlerts: 0 });
  const pollingRef = useRef();


  // Poll for latest 10 transactions and dashboard summary every 1 second
  useEffect(() => {
    const fetchLatest = () => {
      fetch("http://localhost:5000/api/accounts/transactions/latest")
        .then(res => res.json())
        .then(data => {
          setTransactions(data || []);
        });
      fetch("http://localhost:5000/api/accounts/dashboard/summary")
        .then(res => res.json())
        .then(data => {
          setSummary(data || { totalTransactions: 0, totalBalance: 0, fraudAlerts: 0 });
        });
    };
    fetchLatest();
    pollingRef.current = setInterval(fetchLatest, 1000);
    return () => clearInterval(pollingRef.current);
  }, []);

  // WebSocket for real-time fraud alerts and new transactions with reconnection logic
  useEffect(() => {
    let wsRef = { current: null };
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      const ws = new window.WebSocket('ws://127.0.0.1:5050');
      wsRef.current = ws;
      ws.onopen = () => {
        console.log('WebSocket connection established');
      };
      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
      ws.onclose = (event) => {
        console.warn('WebSocket closed:', event);
        if (!event.wasClean && event.code === 1006) {
          console.log('WebSocket closed abnormally, attempting to reconnect...');
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        }
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'fraud_alert') {
            setFraudAlerts((prev) => [
              {
                description: `🚨 Fraud detected: ₹${data.amount} (Txn: ${data.transaction_id}) for ${data.customer_name} [Acc: ${data.account_number}]`,
                date: new Date().toLocaleString()
              },
              ...prev
            ]);
            setNotification(`🚨 Fraud detected for account ${data.account_number}`);
            setTimeout(() => setNotification(""), 4000);
          } else if (data.type === 'transaction_migrated') {
            // Add new transaction to the top and highlight
            setTransactions(prev => [data.transaction, ...prev.slice(0, 9)]);
            setHighlightedIdx(0);
            setTimeout(() => setHighlightedIdx(null), 1200);
          }
        } catch (e) {
          // ignore
        }
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded shadow-lg z-50 animate-bounce">
          {notification}
        </div>
      )}
      <div className="w-full max-w-3xl p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Real-Time Fraud Detection Dashboard</h1>
        <DashboardSummary
          totalTransactions={summary.totalTransactions}
          totalBalance={summary.totalBalance}
          fraudAlerts={summary.fraudAlerts}
        />
        <div className="bg-white rounded shadow p-6 border border-gray-200 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Latest Transactions</h2>
          <TransactionTable
            transactions={transactions.map((txn, idx) => ({
              date: txn.timestamp ? new Date(txn.timestamp).toLocaleString() : "",
              description: `Acc: ${txn.account_number}`,
              amount: txn.amount,
              type: txn.payment_method || "",
              balance: txn.status || "",
              highlight: idx === highlightedIdx
            }))}
          />
        </div>
        <div className="bg-white rounded shadow p-6 border border-gray-200 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Live Fraud Alerts</h2>
          {fraudAlerts.length === 0 ? (
            <p className="text-gray-400">No recent fraud alerts.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {fraudAlerts.map((alert, idx) => (
                <li key={idx} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="font-medium text-gray-700">{alert.description}</span>
                  <span className="text-sm text-gray-500">{alert.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
