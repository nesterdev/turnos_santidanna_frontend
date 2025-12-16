import { apiFetch } from "../utils/fetch";

export function getEmployees() {
  return apiFetch("/employees");
}

export function getEmployee(id) {
  return apiFetch(`/employees/${id}`);
}

export function createEmployee(data) {
  return apiFetch("/employees", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateEmployee(id, data) {
  return apiFetch(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteEmployee(id) {
  return apiFetch(`/employees/${id}`, {
    method: "DELETE",
  });
}
