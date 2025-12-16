import { apiFetch } from "../utils/fetch";

export function getSettings() {
  return apiFetch("/settings");
}

export function updateSettings(data) {
  return apiFetch("/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
