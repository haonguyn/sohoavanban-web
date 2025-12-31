import type { LoginPayload, LoginResponse, User } from "../types/UserTypes";
import api from "./axios"; // axios instance

// Auth APIs
export const login = async (data: LoginPayload) => {
  const res = await api.post<LoginResponse>("/auth/login/", data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post<{ message: string }>("/auth/logout/");
  return res.data;
};

// User management APIs
export const listUsers = async () => {
  const res = await api.get<User[]>("/admin/users/");
  return res.data;
};

export const createUser = async (
  data: Partial<User>
) => {
  const res = await api.post("/admin/users/create/", data);
  return res.data;
};

export const retrieveUser = async (id: string) => {
  const res = await api.get<User>(`/admin/users/${id}/`);
  return res.data;
};

export const updateUser = async (id: string, data: Partial<User>) => {
  const res = await api.put(`/admin/users/${id}/update/`, data);
  return res.data;
};

export const deleteUser = async (id: string| number) => {
  const res = await api.delete(`/admin/users/${id}/delete/`);
  return res.data;
};
