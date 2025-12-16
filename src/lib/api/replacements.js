import { apiFetch } from "../utils/fetch";

export function getReplacements() {
  return apiFetch("/replacements");
}

export function createReplacement(data) {
  return apiFetch("/replacements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateReplacement(id, data) {
  return apiFetch(`/replacements/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteReplacement(id) {
  return apiFetch(`/replacements/${id}`, {
    method: "DELETE",
  });
}
