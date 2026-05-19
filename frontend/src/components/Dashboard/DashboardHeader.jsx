import { useEffect, useState } from "react";
import { getUserName } from "../../api/dashboard";

export default function DashboardHeader() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const data = await getUserName();
      setUsername(data.username);
    };

    fetchUsername();
  }, []);

  return (
    <header className="dashboard-header">
      <div>
        <h2>Welcome back, {username}!</h2>
        <p>Here's what's happening with your links today.</p>
      </div>

      <div className="dashboard-user">
        <div className="dashboard-avatar">
          <span>{username ? username.charAt(0).toUpperCase() : "A"}</span>
          <span></span>
        </div>
      </div>
    </header>
  );
}
