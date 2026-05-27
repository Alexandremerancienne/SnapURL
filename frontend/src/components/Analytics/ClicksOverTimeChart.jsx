import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../../api/analytics";

export default function ClicksOverTimeChart() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getAnalyticsOverview();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <section className="clicks-over-time-chart">
      <h5>Clicks Over Time</h5>
      {stats && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.daily_clicks}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
