import { apiFetch } from "./client";

function buildParams(q = {}) {
  const params = new URLSearchParams();

  if (q.title !== undefined && q.title !== null && String(q.title).trim() !== "") {
    params.set("title", String(q.title).trim());
  }

  if (q.category !== undefined && q.category !== null && String(q.category).trim() !== "") {
    params.set("category", String(q.category).trim());
  }

  return params.toString();
}

export const booksApi = {
  list: (q = {}) => {
    const params = buildParams(q);
    return apiFetch(`/books${params ? `?${params}` : ""}`);
  },
  get: (isbn) => apiFetch(`/books/${isbn}`),
};
