import React from "react";

// Simple SVG heatmap for demo (India outline with colored circles for cities)
const GeoHeatmap = () => (
  <div className="bg-white rounded shadow p-6 border border-gray-200 flex flex-col items-center">
    <div className="text-lg font-semibold mb-2 text-gray-800">Geographical Heatmap</div>
    <div className="w-full h-56 flex items-center justify-center">
      <svg viewBox="0 0 300 200" width="260" height="180">
        {/* India outline (very rough) */}
        <polyline points="60,180 80,120 100,100 120,80 140,60 160,80 180,100 200,120 220,140 240,180" fill="none" stroke="#888" strokeWidth="2" />
        {/* Hotspots (Mumbai, Delhi, Chennai, Bangalore, Kolkata) */}
        <circle cx="90" cy="120" r="12" fill="#ef4444" fillOpacity="0.7" /> {/* Mumbai */}
        <circle cx="180" cy="80" r="8" fill="#f59e42" fillOpacity="0.7" /> {/* Delhi */}
        <circle cx="120" cy="160" r="7" fill="#22c55e" fillOpacity="0.7" /> {/* Chennai */}
        <circle cx="150" cy="140" r="6" fill="#3b82f6" fillOpacity="0.7" /> {/* Bangalore */}
        <circle cx="200" cy="100" r="5" fill="#eab308" fillOpacity="0.7" /> {/* Kolkata */}
        {/* Labels */}
        <text x="80" y="115" fontSize="10" fill="#333">Mumbai</text>
        <text x="170" y="75" fontSize="10" fill="#333">Delhi</text>
        <text x="110" y="175" fontSize="10" fill="#333">Chennai</text>
        <text x="145" y="155" fontSize="10" fill="#333">Bangalore</text>
        <text x="210" y="95" fontSize="10" fill="#333">Kolkata</text>
      </svg>
    </div>
    <div className="text-xs text-gray-500 mt-2">Red = high fraud, Green = low</div>
  </div>
);

export default GeoHeatmap;
