import { apiFetch } from "../utils/fetch";

export function getShifts() {
  return apiFetch("/shifts");
}

export function createShift(data) {
  return apiFetch("/shifts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateShift(id, data) {
  return apiFetch(`/shifts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteShift(id) {
  return apiFetch(`/shifts/${id}`, {
    method: "DELETE",
  });
}
