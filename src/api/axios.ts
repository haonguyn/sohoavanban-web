// src/api/axios.ts
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000,
});

// Attach Authorization header nếu có token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    if (status === 401) {
      // Token hết hạn/không hợp lệ → xóa token và điều hướng về login, giữ redirect
      const current = window.location.pathname + window.location.search;
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
      return; // kết thúc
    }
    return Promise.reject(err);
  }
);

export default api;
