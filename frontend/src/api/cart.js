import { apiFetch } from "./client";

export const cartApi = {
  get: (token) => apiFetch("/cart", { token }),
  add: (token, isbn, qty) => apiFetch("/cart/items", { method: "POST", token, body: { isbn, qty } }),
  update: (token, isbn, qty) => apiFetch(`/cart/items/${isbn}`, { method: "PATCH", token, body: { qty } }),
  remove: (token, isbn) => apiFetch(`/cart/items/${isbn}`, { method: "DELETE", token }),
  clear: (token) => apiFetch("/cart", { method: "DELETE", token }),
};
