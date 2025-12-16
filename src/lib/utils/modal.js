export function openConfirmModal({
  title = "Confirmar acción",
  message = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  return new Promise((resolve) => {
    /* ---------- Overlay con blur ---------- */
    const overlay = document.createElement("div");
    overlay.className = `
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/30 backdrop-blur-sm
      transition-opacity duration-300
      opacity-0
    `;

    /* ---------- Modal ---------- */
    const modal = document.createElement("div");
    modal.className = `
      bg-white rounded-2xl shadow-2xl
      w-full max-w-md p-6
      transform transition-all duration-300
      scale-95 opacity-0
    `;

    modal.innerHTML = `
      <div class="flex items-start gap-3 mb-4">
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
          ⚠️
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">${title}</h2>
          <p class="text-gray-600 mt-1">${message}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700
                 hover:bg-gray-200 transition"
        >
          ${cancelText}
        </button>

        <button
          class="px-4 py-2 rounded-lg bg-red-600 text-white
                 hover:bg-red-700 shadow-md
                 transition active:scale-95"
        >
          ${confirmText}
        </button>
      </div>
    `;

    const [cancelBtn, confirmBtn] = modal.querySelectorAll("button");

    /* ---------- Cerrar con animación ---------- */
    const close = (result) => {
      modal.classList.add("scale-95", "opacity-0");
      overlay.classList.add("opacity-0");

      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    cancelBtn.onclick = () => close(false);
    confirmBtn.onclick = () => close(true);

    /* ---------- Cerrar clic fuera ---------- */
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });

    /* ---------- Montar ---------- */
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    /* ---------- Animación entrada ---------- */
    requestAnimationFrame(() => {
      overlay.classList.remove("opacity-0");
      modal.classList.remove("scale-95", "opacity-0");
    });
  });
}
