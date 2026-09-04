import { apiFetch } from "../utils/fetch";

export function getSettings() {
  return apiFetch("/settings");
}

export const settingsApi = {
  async getAll() {
    return await apiFetch("/settings");
  },
  async create(data) {
    return await apiFetch("/settings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(data) {
    return await apiFetch("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
};