import { LayoutGrid, Link as LinkIcon, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <LinkIcon size={30} className="logo-icon" />
          <div className="logo-text">
            <span className="logo-black">Snap</span>
            <span className="logo-blue">URL</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/dashboard" className="nav-item">
          <LayoutGrid size={18} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link to="/login" className="nav-item">
          <User size={18} className="nav-icon" />
          <span className="nav-text">Login</span>
        </Link>
      </div>
    </nav>
  );
}
