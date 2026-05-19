import { Link as LinkIcon, MousePointer, Calendar } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stat-card">
        <div className="icon-box purple">
          <LinkIcon size={25} />
        </div>
        <div className="stat-text">
          <p>Total Links</p>
          <h2>12</h2>
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
          <h2>1,240</h2>
        </div>
        <div className="stat-link">
          <a href="#" className="stat-link">
            View all your clicks
          </a>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box green">
          <Calendar size={25} />
        </div>
        <div className="stat-text">
          <p>This Month</p>
          <h2>340</h2>
        </div>
        <div className="stat-link">
          <a href="#" className="stat-link">
            View monthly report your monthly stats
          </a>
        </div>
      </div>
    </section>
  );
}
