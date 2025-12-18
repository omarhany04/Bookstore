import { apiFetch } from "./client";

export const categoriesApi = {
  list: () => apiFetch("/categories"),
};
