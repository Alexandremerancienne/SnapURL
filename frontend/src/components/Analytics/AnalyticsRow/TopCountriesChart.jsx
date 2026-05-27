import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { getCountryStats } from "../../../api/analytics";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export default function TopCountriesChart() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getCountryStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  const getCountryName = (countryCode) => {
    return countries.getName(countryCode, "en") || countryCode;
  };

  // Add country flags with flagcdn
  const getFlagUrl = (countryCode) => {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  const renderCustomBarLabel = ({ x, y, width, height, value }) => {
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
  };

  const formattedData = stats?.top_countries.map((item) => ({
    ...item,
    countryLabel: getCountryName(item.country),
  }));

  const CustomYAxisTick = ({ x, y, payload }) => {
    const country = stats.top_countries.find(
      (item) => getCountryName(item.country) === payload.value,
    );

    return (
      <g transform={`translate(${x},${y})`}>
        <image
          href={getFlagUrl(country.country)}
          x={-170}
          y={-10}
          width={20}
          height={15}
        />

        <text
          x={-140}
          y={0}
          dy={4}
          textAnchor="start"
          fill="#666"
          fontSize={10}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <section className="top-countries-chart">
      <h5>Top Countries</h5>

      {stats && (
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
              tick={<CustomYAxisTick />}
            />

            <Tooltip />

            <Bar dataKey="count" fill="#8884d8" label={renderCustomBarLabel} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
