import { useNavigate } from "react-router-dom";
import {
  House,
  Link2,
  Link as LinkIcon,
  ChartColumnBig,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login", { replace: true });
  };

  const handleAnalytics = () => {
    navigate("/analytics", { replace: true });
  };

  const handleMyLinks = () => {
    navigate("/links", { replace: true });
  };

  const handleDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LinkIcon size={30} className="logo-icon" />
        <div className="logo-text">
          <span className="logo-black">Snap</span>
          <span className="logo-blue">URL</span>
        </div>
      </div>
      <nav className="sidebar-menu">
        <button className="sidebar-item active" onClick={handleDashboard}>
          <House size={18} />
          <span>Dashboard</span>
        </button>

        <button className="sidebar-item" onClick={handleMyLinks}>
          <Link2 size={18} className="rotate-icon" />
          <span>My Links</span>
        </button>

        <button className="sidebar-item" onClick={handleAnalytics}>
          <ChartColumnBig size={18} />
          <span>Analytics</span>
        </button>

        <button className="sidebar-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button className="sidebar-item" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
