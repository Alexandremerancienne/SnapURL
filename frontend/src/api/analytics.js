import { get } from "./apiClient";

export const getAnalyticsOverview = () => get("analytics/overview/");
