import { apiFetch } from "../utils/fetch";

export function getSchedules() {
  return apiFetch("/schedules");
}

export function createSchedule(data) {
  return apiFetch("/schedules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSchedule(id, data) {
  return apiFetch(`/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteSchedule(id) {
  return apiFetch(`/schedules/${id}`, { method: "DELETE" });
}

// En tu librería de api para schedules
export async function updateScheduleAttendance(id, attendanceData) {
  return await apiFetch(`/schedules/${id}/attendance`, {
    method: "PUT",
    body: JSON.stringify(attendanceData),
  });
}