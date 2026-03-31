import { apiFetch } from "./client";

export const publishersApi = {
  list: () => apiFetch("/publishers"),
};
