import { api } from "./axios";

export const getAnalyticsStats = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("analytics/stats/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getClicksStats = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("analytics/clicks/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getCountryStats = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("analytics/countries/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
