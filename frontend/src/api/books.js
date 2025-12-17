import { apiFetch } from "./client";

export const booksApi = {
  list: (q = {}) => {
    const params = new URLSearchParams(q).toString();
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },
  get: (isbn) => apiFetch(`/books/${isbn}`),
};
