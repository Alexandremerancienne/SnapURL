import { api } from "./axios";

const isExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const getUsableAccessToken = async () => {
  const access = localStorage.getItem("access");

  if (access && !isExpired(access)) {
    return access;
  }

  const refresh = localStorage.getItem("refresh");

  if (!refresh || isExpired(refresh)) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }

  try {
    const response = await api.post("auth/token/refresh/", { refresh });
    localStorage.setItem("access", response.data.access);
    return response.data.access;
  } catch {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }
};