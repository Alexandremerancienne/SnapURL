import { Users, MousePointerClick, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StatsSection({ stats }) {
  return (
    <section className="stats-section">
      <div className="stat-card">
        <div className="icon-box purple">
          <MousePointerClick size={25} />
        </div>
        <div className="stat-text">
          <p>Total Clicks</p>
          <h2>{stats ? stats.total_clicks : "0"}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box blue">
          <Users size={25} />
        </div>
        <div className="stat-text">
          <p>Unique Visitors</p>
          <h2>{stats ? stats.unique_visitors : "0"}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box green">
          <Clock size={25} />
        </div>
        <div className="stat-text">
          <p>Last Click</p>
          <h2>
            {stats?.last_click
              ? formatDistanceToNow(new Date(stats.last_click), {
                  addSuffix: true,
                })
              : "No activity"}
          </h2>
        </div>
      </div>
    </section>
  );
}
