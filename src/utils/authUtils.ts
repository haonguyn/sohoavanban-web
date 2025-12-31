import { logout } from "../api/userApi";

// src/utils/authUtils.ts
export function setAuth(data: {
  access_token: string;
  role: string;
  username: string;
  full_name: string;
}) {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("role", data.role);
  localStorage.setItem(
    "user_info",
    JSON.stringify({
      username: data.username,
      full_name: data.full_name,
      role: data.role,
    })
  );
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user_info");
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function hasRole(required: string[] = []) {
  const role = getRole();
  return role ? required.includes(role) : false;
}

export function getRedirectQuery(routeQuery: Record<string, any>) {
  const redirect = routeQuery?.redirect;
  return typeof redirect === "string" ? redirect : undefined;
}

export async function doLogout() {
  try {
    const res = await logout();
    console.log(res.message);
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    clearAuth();
    const current = window.location.pathname + window.location.search;
    window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
  }
}
