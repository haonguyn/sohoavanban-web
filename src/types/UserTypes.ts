// src/types/UserTypes.ts

export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  created_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
