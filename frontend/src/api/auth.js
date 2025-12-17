import { apiFetch } from "./client";

export const authApi = {
  login: (username, password) => apiFetch("/auth/login", { method: "POST", body: { username, password } }),
  register: (payload) => apiFetch("/auth/register", { method: "POST", body: payload }),
  me: (token) => apiFetch("/auth/me", { token }),
  updateMe: (token, payload) => apiFetch("/auth/me", { method: "PATCH", token, body: payload }),
};
