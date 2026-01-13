// src/api/axios.ts
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { clearAuth } from "../utils/authUtils";
import { useConfirmStore } from "../store/confirmStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
  async (err: AxiosError<any>) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Có lỗi xảy ra";

    const confirm = useConfirmStore();
    const isLoginPage = window.location.pathname.startsWith("/login");
    if (status === 401 || status === 403) {
      await confirm.open(message || "Phiên đăng nhập đã hết hạn.");
      clearAuth();
      if (!isLoginPage) {
        const current = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default api;
