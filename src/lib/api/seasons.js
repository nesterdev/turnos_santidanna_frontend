import { apiFetch } from "../utils/fetch";

export function getSeasons() {
  return apiFetch("/seasons");
}

export function createSeason(data) {
  return apiFetch("/seasons", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSeason(id, data) {
  return apiFetch(`/seasons/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteSeason(id) {
  return apiFetch(`/seasons/${id}`, {
    method: "DELETE",
  });
}
