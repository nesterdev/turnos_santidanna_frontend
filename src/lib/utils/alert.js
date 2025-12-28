import { Howl } from "howler";

let container = null;
let isOpen = false;
let queue = [];

const sounds = {
  success: new Howl({ src: ["/sounds/success.wav"], volume: 0.4 }),
  error: new Howl({ src: ["/sounds/error.wav"], volume: 0.45 }),
  loading: new Howl({ src: ["/sounds/info.wav"], volume: 0.25 }),
};

/* -------------------- Utils -------------------- */
function playSound(type, options) {
  if (options?.silent) return;
  sounds[type]?.play();
}

function vibrateAlert(type, options) {
  if (options?.silent || options?.noVibrate) return;
  if (!navigator.vibrate || type === "loading") return;

  navigator.vibrate(type === "success" ? 40 : [30, 40, 30]);
}

/* -------------------- DOM -------------------- */
function ensureContainer() {
  if (!container) {
    container = document.createElement("div");
    container.id = "alert-root";
    document.body.appendChild(container);
    injectStyles();
  }
}

function injectStyles() {
  if (document.getElementById("alert-styles")) return;

  const style = document.createElement("style");
  style.id = "alert-styles";
  style.innerHTML = `
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes toast-out {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(40px); }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    .toast-enter {
      animation: toast-in .25s ease-out forwards;
    }

    .toast-exit {
      animation: toast-out .2s ease-in forwards;
    }
  `;
  document.head.appendChild(style);
}

/* -------------------- Close & Queue -------------------- */
function closeAlert(onClose) {
  const card = container.querySelector(".toast-card");
  if (!card) return;

  card.classList.add("toast-exit");

  setTimeout(() => {
    container.innerHTML = "";
    isOpen = false;
    onClose?.();
    processQueue();
  }, 200);
}

function processQueue() {
  if (queue.length === 0 || isOpen) return;
  const next = queue.shift();
  showAlert(next.type, next.message, next.options, true);
}

/* -------------------- Swipe -------------------- */
function enableSwipe(card, onClose) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    dragging = true;
    card.style.transition = "none";
  });

  card.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    currentX = e.touches[0].clientX - startX;
    if (currentX > 0) {
      card.style.transform = `translateX(${currentX}px)`;
    }
  });

  card.addEventListener("touchend", () => {
    dragging = false;
    card.style.transition = "transform .2s ease";

    if (currentX > 80) {
      closeAlert(onClose);
    } else {
      card.style.transform = "translateX(0)";
    }

    currentX = 0;
  });
}

/* -------------------- Main -------------------- */
export function showAlert(type, message, options = {}, fromQueue = false) {
  ensureContainer();

  if (isOpen && !fromQueue) {
    queue.push({ type, message, options });
    return;
  }

  isOpen = true;
  playSound(type, options);
  vibrateAlert(type, options);

  const {
    duration = type === "loading" ? null : 1600,
    onClose,
    closable = type !== "loading",
  } = options;

  container.innerHTML = `
    <div class="fixed top-4 right-4 z-50">
      <div class="toast-card toast-enter w-[340px] rounded-xl shadow-xl overflow-hidden
        ${type === "success" ? "bg-green-50 text-green-700" : ""}
        ${type === "error" ? "bg-red-50 text-red-700" : ""}
        ${type === "loading" ? "bg-blue-50 text-blue-700" : ""}">
        
        <div class="p-4 flex items-start gap-3">
          <div class="flex-1">
            <h4 class="font-semibold text-sm">
              ${type === "success" ? "Éxito" : type === "error" ? "Error" : "Procesando"}
            </h4>
            <p class="text-sm mt-1">${message}</p>
          </div>

          ${
            closable
              ? `<button id="alert-close" class="text-lg opacity-50 hover:opacity-100">&times;</button>`
              : ""
          }
        </div>

        ${
          duration
            ? `<div class="h-[3px] bg-black/10">
                 <div class="h-full bg-current"
                      style="animation: progress ${duration}ms linear forwards"></div>
               </div>`
            : ""
        }
      </div>
    </div>
  `;

  const card = container.querySelector(".toast-card");
  const closeBtn = container.querySelector("#alert-close");

  enableSwipe(card, onClose);

  closeBtn?.addEventListener("click", () => closeAlert(onClose));

  if (duration) {
    setTimeout(() => closeAlert(onClose), duration);
  }
}

/* -------------------- Helpers -------------------- */
export const showSuccess = (msg, options) =>
  showAlert("success", msg, options);

export const showError = (msg, options) =>
  showAlert("error", msg, options);

export const showLoading = (msg = "Procesando…", options = {}) =>
  showAlert("loading", msg, { ...options, closable: false });
