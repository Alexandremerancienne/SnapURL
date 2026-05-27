import { api } from "./axios";

// Add interceptor to include the access token in the Authorization header for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to make GET requests and return the data
const get = async (url) => {
  const { data } = await api.get(url);
  return data;
};

export const getAnalyticsOverview = () => get("analytics/overview/");
