import React from "react";

const Sidebar = ({ setActivePage, sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <div
      className={`fixed md:static top-0 left-0 h-full z-20 bg-gray-900 text-white flex flex-col transition-all duration-200 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "md:w-16 w-64" : "w-64"}`}
      style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.08)" }}
    >
      <div className="p-4 text-2xl font-bold border-b border-gray-700 flex items-center justify-between relative">
        {!sidebarCollapsed && (
          <span className="flex-1">Bank Portal</span>
        )}
        {/* Collapse/Expand button for desktop - always visible and clickable */}
        <button
          className={`hidden md:inline text-white text-xl focus:outline-none ml-2 flex-shrink-0 cursor-pointer ${sidebarCollapsed ? "absolute left-1/2 -translate-x-1/2" : ""}`}
          style={{ minWidth: 32, minHeight: 32, opacity: 1, pointerEvents: 'auto', top: 16, marginBottom: 0 }}
          onClick={() => setSidebarCollapsed((c) => !c)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          tabIndex={0}
        >
          {sidebarCollapsed ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          )}
        </button>
        {/* Close button for mobile */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none ml-2"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          &times;
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={() => { setActivePage("dashboard"); setSidebarOpen(false); }} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${sidebarCollapsed ? "text-center" : ""}`}>{sidebarCollapsed ? <span title="Dashboard">📊</span> : "Dashboard"}</button>
        <button onClick={() => { setActivePage("transactions"); setSidebarOpen(false); }} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${sidebarCollapsed ? "text-center" : ""}`}>{sidebarCollapsed ? <span title="Transactions">💳</span> : "Transactions"}</button>
        <button onClick={() => { setActivePage("reports"); setSidebarOpen(false); }} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${sidebarCollapsed ? "text-center" : ""}`}>{sidebarCollapsed ? <span title="Reports">�</span> : "Reports"}</button>
        <button onClick={() => { setActivePage("settings"); setSidebarOpen(false); }} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${sidebarCollapsed ? "text-center" : ""}`}>{sidebarCollapsed ? <span title="Settings">⚙️</span> : "Settings"}</button>
        <button onClick={() => { setActivePage("profile"); setSidebarOpen(false); }} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${sidebarCollapsed ? "text-center" : ""}`}>{sidebarCollapsed ? <span title="Profile">👤</span> : "Profile"}</button>
      </nav>
    </div>
  );
};

export default Sidebar;
