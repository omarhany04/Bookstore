import { apiFetch } from "./client";

export const ordersApi = {
  checkout: (token, payload) => apiFetch("/orders/checkout", { method: "POST", token, body: payload }),
  mine: (token) => apiFetch("/orders/mine", { token }),
  cancel: (token, orderId) => apiFetch(`/orders/${orderId}`, { method: "DELETE", token }),
};
