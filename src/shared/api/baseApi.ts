import axios from "axios";

export const baseApi = axios.create({
  baseURL: "https://deverse-backend-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
