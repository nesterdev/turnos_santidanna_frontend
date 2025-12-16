import { apiFetch } from "../utils/fetch";

export function getAvailability() {
  return apiFetch("/availability");
}

export function createAvailability(data) {
  return apiFetch("/availability", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAvailability(id, data) {
  return apiFetch(`/availability/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteAvailability(id) {
  return apiFetch(`/availability/${id}`, {
    method: "DELETE",
  });
}
