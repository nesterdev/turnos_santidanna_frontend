import { showError, showSuccess } from "./alert";

export async function apiAction(promise, successMessage, onClose) {
  try {
    const res = await promise;

    if (res && res.success === false) {
      showError(res.message || "Error en la operación");
      return;
    }

    showSuccess(successMessage, { onClose });
  } catch (err) {
    console.error("Detalle capturado en apiAction:", err);
    // 🔥 Leemos directamente el mensaje de la excepción lanzada por apiFetch
    showError(err?.message || "Error inesperado");
  }
}