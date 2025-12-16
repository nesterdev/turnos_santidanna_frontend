import { atom } from "nanostores";

const LS_KEY = "system_settings";

function isBrowser() {
  return typeof window !== "undefined";
}

function loadSettings() {
  if (!isBrowser()) return {}; // SSR-safe

  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const systemSettings = atom(loadSettings());

// Guarda y sincroniza settings
export function setSettings(newSettings) {
  const current = systemSettings.get();
  const merged = { ...current, ...newSettings }; // merge inteligente

  systemSettings.set(merged);

  if (isBrowser()) {
    localStorage.setItem(LS_KEY, JSON.stringify(merged));
  }
}

// Obtiene un valor específico
export function getSetting(key, fallback = null) {
  const settings = systemSettings.get();
  return settings?.[key] ?? fallback;
}

// Limpia las configuraciones
export function resetSettings() {
  systemSettings.set({});
  if (isBrowser()) localStorage.removeItem(LS_KEY);
}

// Sincroniza settings entre pestañas
if (isBrowser()) {
  window.addEventListener("storage", (event) => {
    if (event.key === LS_KEY && event.newValue) {
      systemSettings.set(JSON.parse(event.newValue));
    }
  });
}
