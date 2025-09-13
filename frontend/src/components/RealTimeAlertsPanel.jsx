import React, { useEffect, useRef } from "react";

const sampleAlerts = [
  "🚨 Fraud detected: ₹15,000 at Electronics, Mumbai",
  "⚠️ Unusual UPI transaction at 2:30 AM",
  "🚨 Fraud detected: ₹8,200 at Online Shopping, Delhi",
  "⚠️ Suspicious login from new device, Chennai",
  "🚨 Fraud detected: ₹22,000 at Travel, Bangalore",
  "⚠️ Multiple failed login attempts, Kolkata",
];

const RealTimeAlertsPanel = () => {
  const panelRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (panelRef.current) {
        panelRef.current.scrollTop = panelRef.current.scrollHeight;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 border border-red-200 w-80 h-80 overflow-y-auto flex flex-col">
      <div className="text-lg font-semibold mb-2 text-red-700">Real-Time Alerts</div>
      <div ref={panelRef} className="flex-1 space-y-2">
        {sampleAlerts.map((alert, i) => (
          <div key={i} className="bg-red-50 border-l-4 border-red-400 p-2 text-sm text-red-800 rounded">
            {alert}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeAlertsPanel;
