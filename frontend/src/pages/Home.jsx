import React from "react";
import DashboardKPI from "../components/DashboardKPI";
import FraudVsNonFraudPie from "../components/FraudVsNonFraudPie";
import FraudTrendsLineChart from "../components/FraudTrendsLineChart";
import HighRiskMerchantBar from "../components/HighRiskMerchantBar";
import GeoHeatmap from "../components/GeoHeatmap";
import TopRiskCustomersTable from "../components/TopRiskCustomersTable";
import RealTimeAlertsPanel from "../components/RealTimeAlertsPanel";
import TransactionTypeRiskBar from "../components/TransactionTypeRiskBar";
import FraudAmountHistogram from "../components/FraudAmountHistogram";
import CaseManagementPanel from "../components/CaseManagementPanel";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <DashboardKPI />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="space-y-6 col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FraudVsNonFraudPie />
            <FraudTrendsLineChart />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HighRiskMerchantBar />
            <GeoHeatmap />
          </div>
          <TransactionTypeRiskBar />
          <FraudAmountHistogram />
          <CaseManagementPanel />
        </div>
        <div className="space-y-6">
          <TopRiskCustomersTable />
          <RealTimeAlertsPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;
