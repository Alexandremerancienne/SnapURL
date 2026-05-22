import { api } from "./axios";

export const getDashboardStats = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("dashboard/stats/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const getUserName = async () => {
  const token = localStorage.getItem("access");
  const response = await api.get("dashboard/username/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getDashboardLinks = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("dashboard/links/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
