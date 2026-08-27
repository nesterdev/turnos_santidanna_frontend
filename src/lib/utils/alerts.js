import { Howl } from "howler";

const sounds = {
  success: new Howl({ src: ["/sounds/success.wav"], volume: 0.4 }),
  error: new Howl({ src: ["/sounds/error.wav"], volume: 0.45 }),
  loading: new Howl({ src: ["/sounds/info.wav"], volume: 0.25 }),
};

function playSound(type, options) {
  if (options?.silent) return;
  sounds[type]?.play();
}

function vibrateAlert(type, options) {
  if (options?.silent || options?.noVibrate) return;
  if (!navigator.vibrate || type === "loading") return;
  navigator.vibrate(type === "success" ? 40 : [30, 40, 30]);
}

export function showAlert(type, message, options = {}) {
  playSound(type, options);
  vibrateAlert(type, options);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: { id: Date.now(), type, message, options },
      })
    );
  }
}

export const showSuccess = (msg, options) => showAlert("success", msg, options);
export const showError = (msg, options) => showAlert("error", msg, options);
export const showLoading = (msg = "Procesando…", options = {}) =>
  showAlert("loading", msg, { ...options, closable: false });