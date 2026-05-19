import { api } from "./axios";

// REGISTER
export const register = async (data) => {
  const response = await api.post("auth/register/", data);
  return response.data;
};

// LOGIN
export const login = async (data) => {
  const response = await api.post("auth/token/", data);
  return response.data;
};
