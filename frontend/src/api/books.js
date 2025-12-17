import { apiFetch } from "./client";

function buildParams(q = {}) {
  const params = new URLSearchParams();

  if (q.title !== undefined && q.title !== null && String(q.title).trim() !== "") {
    params.set("title", String(q.title).trim());
  }

  if (q.category !== undefined && q.category !== null && String(q.category).trim() !== "") {
    params.set("category", String(q.category).trim());
  }

  // pagination
  if (q.page !== undefined && q.page !== null) params.set("page", String(q.page));
  if (q.pageSize !== undefined && q.pageSize !== null) params.set("pageSize", String(q.pageSize));

  return params.toString();
}

export const booksApi = {
  // old behavior: returns array (no paging params)
  list: (q = {}) => {
    const params = buildParams({ title: q.title, category: q.category });
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },

  // new behavior: returns { items, total, page, pageSize }
  listPaged: (q = {}) => {
    const params = buildParams(q);
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },

  get: (isbn) => apiFetch(`/books/${isbn}`),
};
