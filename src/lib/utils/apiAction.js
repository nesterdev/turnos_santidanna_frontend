import { showError, showSuccess } from "./alert";

export async function apiAction(promise, successMessage, onClose) {
  try {
    const res = await promise;

    if (!res?.success) {
        console.log("respuesta desde apiAction",res)
      showError(res?.message || "Error");
      return;
    }

    showSuccess(successMessage, { onClose });
  } catch {
    showError("Error inesperado");
  }
}
