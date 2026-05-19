import { Users, MousePointerClick, Clock } from "lucide-react";
import { getDashboardStats } from "../../api/dashboard";

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stat-card">
        <div className="icon-box purple">
          <MousePointerClick size={25} />
        </div>
        <div className="stat-text">
          <p>Total Clicks</p>
          <h2>?</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box blue">
          <Users size={25} />
        </div>
        <div className="stat-text">
          <p>Unique Visitors</p>
          <h2>?</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box green">
          <Clock size={25} />
        </div>
        <div className="stat-text">
          <p>Last Click</p>
          <h2>?</h2>
        </div>
      </div>
    </section>
  );
}
