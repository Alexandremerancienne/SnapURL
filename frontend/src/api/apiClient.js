import { api } from "./axios";

export const get = async (url) => {
  const { data } = await api.get(url);
  return data;
};

export const post = async (url, payload) => {
  const { data } = await api.post(url, payload);
  return data;
};

export const patch = async (url, payload) => {
  const { data } = await api.patch(url, payload);
  return data;
};

export const put = async (url, payload) => {
  const { data } = await api.put(url, payload);
  return data;
};

export const del = async (url) => {
  const { data } = await api.delete(url);
  return data;
};
