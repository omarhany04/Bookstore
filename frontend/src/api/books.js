import { apiFetch } from "./client";

function buildParams(q = {}) {
  const params = new URLSearchParams();

  // Send the single search string
  if (q.search?.trim()) {
    params.set("search", q.search.trim());
  }

  if (q.category_id) params.set("category_id", String(q.category_id));

  // Pagination
  if (q.page) params.set("page", String(q.page));
  if (q.pageSize) params.set("pageSize", String(q.pageSize));

  return params.toString();
}

export const booksApi = {
  listPaged: (q = {}) => {
    const params = buildParams(q);
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },
  get: (isbn) => apiFetch(`/books/${isbn}`),
  update: (token, isbn, payload) => 
    apiFetch(`/admin/books/${isbn}`, { method: "PATCH", token, body: payload }),
};