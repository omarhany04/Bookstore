import { apiFetch } from "./client";

function buildParams(q = {}) {
  const params = new URLSearchParams();

  if (q.title !== undefined && q.title !== null && String(q.title).trim() !== "") {
    params.set("title", String(q.title).trim());
  }

  // category_id 
  if (q.category_id !== undefined && q.category_id !== null && String(q.category_id).trim() !== "") {
    params.set("category_id", String(q.category_id).trim());
  }

  // pagination
  if (q.page !== undefined && q.page !== null) params.set("page", String(q.page));
  if (q.pageSize !== undefined && q.pageSize !== null) params.set("pageSize", String(q.pageSize));

  return params.toString();
}

export const booksApi = {
  list: (q = {}) => {
    const params = buildParams({ title: q.title, category_id: q.category_id });
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },

  listPaged: (q = {}) => {
    const params = buildParams(q);
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },

  get: (isbn) => apiFetch(`/books/${isbn}`),
  
  update: (token, isbn, payload) => 
    apiFetch(`/admin/books/${isbn}`, { 
      method: "PATCH", 
      token, 
      body: payload 
    }),
};
