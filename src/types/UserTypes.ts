// src/types/UserTypes.ts

export interface User {
  id: string | number;
  username : string,
  password :string,
  email: string;
  full_name: string;
  is_active: boolean;
  role?: string;
  created_at?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user_id: string | number;
  username: string;
  role: string;
  full_name: string;
}