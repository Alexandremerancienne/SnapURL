import { useEffect, useState } from "react";

import Sidebar from "../components/Analytics/Sidebar";
import AnalyticsHeader from "../components/Analytics/AnalyticsHeader";
import StatsSection from "../components/Analytics/StatsSection";
import ClicksOverTimeChart from "../components/Analytics/ClicksOverTimeChart";
import TopCountriesChart from "../components/Analytics/AnalyticsRow/TopCountriesChart";
import ReferrersChart from "../components/Analytics/AnalyticsRow/ReferrersChart";

import { getAnalyticsOverview } from "../api/analytics";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalyticsOverview();
        setAnalytics(data);
        console.log("Fetched analytics data:", data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="dashboard-page">
      <Sidebar />

      <section className="dashboard-content">
        <AnalyticsHeader />
        <StatsSection stats={analytics.stats} />
        <ClicksOverTimeChart data={analytics.daily_clicks} />
        <div className="analytics-row">
          <div className="analytics-row-item">
            {" "}
            <TopCountriesChart stats={analytics} />
          </div>
          <div className="analytics-row-item">
            {" "}
            <ReferrersChart />
          </div>
        </div>
      </section>
    </main>
  );
}
