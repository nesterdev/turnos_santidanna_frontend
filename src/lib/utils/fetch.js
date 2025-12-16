import { getToken, logout } from "./auth";

const API_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(API_URL + endpoint, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    logout();
    throw new Error("No autorizado (401)");
  }

  const text = await res.text();

  // 🔥 respuesta vacía
  if (!text) {
    return { success: true };
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}
