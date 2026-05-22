import Sidebar from "../components/Dashboard/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import LinksTable from "../components/Dashboard/LinksTable";

export default function LinksPage() {
  return (
    <main className="links-page">
      <Sidebar />

      <section className="links-content">
        <DashboardHeader />
        <LinksTable />
      </section>
    </main>
  );
}
