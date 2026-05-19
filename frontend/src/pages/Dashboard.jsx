import Sidebar from "../components/Dashboard/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import StatsSection from "../components/Dashboard/StatsSection";
import LinksTable from "../components/Dashboard/LinksTable";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <Sidebar />

      <section className="dashboard-content">
        <DashboardHeader />
        <StatsSection />
        <LinksTable />
      </section>
    </main>
  );
}
