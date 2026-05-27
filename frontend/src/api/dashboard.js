import { get, patch, del } from "./apiClient";

export const getDashboardStats = () => get("dashboard/stats/");

export const getUserName = () => get("dashboard/username/");

export const getDashboardLinks = () => get("dashboard/links/");

export const deleteDashboardLink = (linkId) => del(`links/${linkId}/`);

export const updateDashboardLink = (linkId, payload) =>
  patch(`links/${linkId}/`, payload);
