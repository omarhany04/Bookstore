import { apiFetch } from "./client";

export const reportsApi = {
  previousMonthSales: (token) => apiFetch("/reports/sales/previous-month", { token }),
  salesByDay: (token, date) => apiFetch(`/reports/sales/by-day?date=${encodeURIComponent(date)}`, { token }),
  topCustomers: (token) => apiFetch("/reports/top-customers?months=3&limit=5", { token }),
  topBooks: (token) => apiFetch("/reports/top-books?months=3&limit=10", { token }),
  replenishmentCount: (token, isbn) => apiFetch(`/reports/book-replenishments/${isbn}/count`, { token }),
  replenishments: (token, status) =>
    apiFetch(`/admin/replenishment-orders${status ? `?status=${encodeURIComponent(status)}` : ""}`, { token }),
};
