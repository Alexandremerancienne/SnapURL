import { api } from "./axios";
import { getUsableAccessToken } from "./tokens";

export const createShortLink = async (data) => {
  const token = await getUsableAccessToken();

  const response = await api.post("links/", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return response.data;
};
