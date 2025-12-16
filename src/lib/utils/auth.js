// /src/lib/utils/auth.js
import { setUser, clearUser } from "../stores/userStore";

/* -------------------------------------------------
   DETECTAR SI ESTAMOS EN EL CLIENTE
------------------------------------------------- */
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/* -------------------------------------------------
   GUARDAR TOKEN (cookie + localStorage)
------------------------------------------------- */
export function saveToken(token, expiresMinutes = 120) {
  if (!isBrowser()) return;

  // Cookie segura
  document.cookie = `token=${token}; max-age=${expiresMinutes * 60}; path=/; SameSite=Lax`;

  // LocalStorage para el cliente
  localStorage.setItem("token", token);
}

/* -------------------------------------------------
   OBTENER TOKEN (desde Cookie o localStorage)
------------------------------------------------- */
export function getToken() {
  if (!isBrowser()) return null;

  // Primero probar cookie (más segura)
  const match = document.cookie.match(/(^| )token=([^;]+)/);

  if (match) return match[2];

  // fallback en localStorage
  return localStorage.getItem("token");
}

/* -------------------------------------------------
   BORRAR TOKEN
------------------------------------------------- */
export function deleteToken() {
  if (!isBrowser()) return;

  document.cookie = "token=; Max-Age=0; path=/;";
  localStorage.removeItem("token");
}

/* -------------------------------------------------
   LOGOUT GLOBAL
------------------------------------------------- */
export function logout() {
  clearUser();
  deleteToken();

  if (isBrowser()) {
    window.location.href = "/auth/login";
  }
}

export function isLoggedIn() {
  return !!(isBrowser() && getToken());
}