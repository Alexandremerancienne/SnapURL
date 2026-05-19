import Sidebar from "../components/Analytics/Sidebar";
import AnalyticsHeader from "../components/Analytics/AnalyticsHeader";
import StatsSection from "../components/Analytics/StatsSection";
import ClicksOverTimeChart from "../components/Analytics/ClicksOverTimeChart";
import TopCountriesChart from "../components/Analytics/AnalyticsRow/TopCountriesChart";
import ReferrersChart from "../components/Analytics/AnalyticsRow/ReferrersChart";

export default function AnalyticsPage() {
  return (
    <main className="dashboard-page">
      <Sidebar />

      <section className="dashboard-content">
        <AnalyticsHeader />
        <StatsSection />
        <ClicksOverTimeChart />
        <div className="analytics-row">
          <div className="analytics-row-item">
            {" "}
            <TopCountriesChart />
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
