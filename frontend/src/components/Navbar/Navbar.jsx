import { Link, LayoutGrid, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <Link size={30} className="logo-icon" />
          <div className="logo-text">
            <span className="logo-black">Snap</span>
            <span className="logo-blue">URL</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <a href="/dashboard" className="nav-item">
          <LayoutGrid size={18} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </a>

        <a href="/login" className="nav-item">
          <User size={18} className="nav-icon" />
          <span className="nav-text">Login</span>
        </a>
      </div>
    </nav>
  );
}
