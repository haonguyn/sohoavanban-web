// src/utils/authUtils.ts

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("access_token");
}

export function logout() {
  localStorage.removeItem("access_token");
}
