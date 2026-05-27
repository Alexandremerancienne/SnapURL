import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState, useCallback } from "react";

import { getAnalyticsOverview } from "../../../api/analytics";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const getCountryName = (countryCode) => {
  return countries.getName(countryCode, "en") || countryCode;
};

const getFlagUrl = (countryCode) => {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

function CustomYAxisTick({ x, y, payload, countriesData }) {
  const country = countriesData.find(
    (item) => getCountryName(item.country) === payload.value,
  );

  if (!country) {
    return null;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href={getFlagUrl(country.country)}
        x={-170}
        y={-10}
        width={20}
        height={15}
      />

      <text x={-140} y={0} dy={4} textAnchor="start" fill="#666" fontSize={10}>
        {payload.value}
      </text>
    </g>
  );
}

export default function TopCountriesChart() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAnalyticsOverview();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch country stats:", error);
      }
    };

    fetchStats();
  }, []);

  const formattedData = stats?.top_countries.map((item) => ({
    ...item,
    countryLabel: getCountryName(item.country),
  }));

  const renderCustomBarLabel = useCallback(
    ({ x, y, width, height, value }) => {
      if (!stats) {
        return null;
      }

      return (
        <text
          x={x + width + 10}
          y={y + height / 2}
          fill="#666"
          fontSize={12}
          textAnchor="start"
          dominantBaseline="middle"
        >
          <tspan fontWeight="bold">{value}</tspan>

          <tspan>
            {` (${((value / stats.total_clicks) * 100).toFixed(1)}%)`}
          </tspan>
        </text>
      );
    },
    [stats],
  );

  const renderYAxisTick = useCallback(
    (props) => (
      <CustomYAxisTick {...props} countriesData={stats?.top_countries || []} />
    ),
    [stats],
  );

  if (!stats) {
    return (
      <section className="top-countries-chart">
        <h5>Top Countries</h5>

        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="top-countries-chart">
      <h5>Top Countries</h5>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 70,
            left: 0,
            bottom: 20,
          }}
        >
          <XAxis type="number" />

          <YAxis
            dataKey="countryLabel"
            type="category"
            width={180}
            tick={renderYAxisTick}
          />

          <Tooltip />

          <Bar dataKey="count" fill="#8884d8" label={renderCustomBarLabel} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
