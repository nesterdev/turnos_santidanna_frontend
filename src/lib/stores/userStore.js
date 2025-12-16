import { atom } from "nanostores";

const LS_KEY = "app_user";

function isBrowser() {
  return typeof window !== "undefined";
}

function loadUser() {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(LS_KEY);
    const data = raw ? JSON.parse(raw) : null;

    if (data?.expiresAt && Date.now() > data.expiresAt) {
      // Sesión expirada
      localStorage.removeItem(LS_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export const user = atom(loadUser());

// Guarda sesión con expiración opcional
export function setUser(u, ttlMinutes = null) {
  const payload = { ...u };

  if (ttlMinutes) {
    payload.expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  }

  user.set(payload);

  if (isBrowser()) {
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }
}

// Limpieza total de datos
export function clearUser() {
  user.set(null);
  if (isBrowser()) localStorage.removeItem(LS_KEY);
}

// Verifica si hay sesión válida
export function isLoggedIn() {
  const u = user.get();
  return !!u;
}

// Obtiene rol
export function getRole() {
  return user.get()?.role || null;
}

// Obtiene el ID del usuario
export function getUserId() {
  return user.get()?.id || null;
}

// Sincronización entre pestañas
if (isBrowser()) {
  window.addEventListener("storage", (event) => {
    if (event.key === LS_KEY) {
      user.set(event.newValue ? JSON.parse(event.newValue) : null);
    }
  });
}
