import { Link as LinkIcon, MousePointer, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboard";

export default function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      console.log("Dashboard stats:", data);
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <section className="stats-section">
      <div className="stat-card">
        <div className="icon-box purple">
          <LinkIcon size={25} />
        </div>
        <div className="stat-text">
          <p>Total Links</p>
          <h2>{stats ? stats.total_links : "0"}</h2>
        </div>
        <div className="stat-link">
          <a href="#" className="stat-link">
            View all your links
          </a>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box blue">
          <MousePointer size={25} />
        </div>
        <div className="stat-text">
          <p>Total Clicks</p>
          <h2>{stats ? stats.total_clicks : "0"}</h2>
        </div>
        <div className="stat-link">
          <a href="#" className="stat-link">
            View analytics
          </a>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box green">
          <Calendar size={25} />
        </div>
        <div className="stat-text">
          <p>This Month</p>
          <h2>{stats ? stats.last_month_clicks : "0"}</h2>
        </div>
        <div className="stat-link">
          <a href="#" className="stat-link">
            View monthly report
          </a>
        </div>
      </div>
    </section>
  );
}
