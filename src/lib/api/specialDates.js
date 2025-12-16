import { apiFetch } from "../utils/fetch";

export function getSpecialDates() {
  return apiFetch("/special-dates");
}

export function createSpecialDate(data) {
  return apiFetch("/special-dates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSpecialDate(id, data) {
  return apiFetch(`/special-dates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteSpecialDate(id) {
  return apiFetch(`/special-dates/${id}`, {
    method: "DELETE",
  });
}
