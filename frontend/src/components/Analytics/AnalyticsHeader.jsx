import { useEffect, useState } from "react";
import { getUserName } from "../../api/dashboard";

export default function AnalyticsHeader() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const data = await getUserName();
      setUsername(data.username);
    };

    fetchUsername();
  }, []);

  return (
    <header className="analytics-header">
      <div>
        <h2>Welcome back, {username}</h2>
        <p>Here's what's happening with your links today.</p>
      </div>

      <div className="analytics-user">
        <div className="analytics-avatar">
          <span>{username ? username[0].toUpperCase() : ""}</span>
          <span></span>
        </div>
      </div>
    </header>
  );
}
