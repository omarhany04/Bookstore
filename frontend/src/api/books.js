import { apiFetch } from "./client";

function buildParams(q = {}) {
  const params = new URLSearchParams();

  // Handle the single search bar input
  if (q.search?.trim()) {
    params.set("search", q.search.trim());
  }

  // Handle category filtering
  if (q.category_id) {
    params.set("category_id", String(q.category_id));
  }

  // Handle pagination
  if (q.page) params.set("page", String(q.page));
  if (q.pageSize) params.set("pageSize", String(q.pageSize));

  return params.toString();
}

export const booksApi = {
  // This fix restores the .list() method for ManageBooks.jsx
  list: (q = {}) => {
    const params = buildParams(q);
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },

  // This handles the paged results for BrowseBooks.jsx
  listPaged: (q = {}) => {
    const params = buildParams(q);
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },

  get: (isbn) => apiFetch(`/books/${isbn}`),

  // Required for Admin to save book edits
  update: (token, isbn, payload) => 
    apiFetch(`/admin/books/${isbn}`, { 
      method: "PATCH", 
      token, 
      body: payload 
    }),
};