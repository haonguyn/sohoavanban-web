// src/utils/authUtils.ts
export function setAuth(data: { access_token: string; role: string }) {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("role", data.role);
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
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
