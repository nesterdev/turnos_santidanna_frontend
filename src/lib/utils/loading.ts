let container: HTMLElement | null = null;
let isOpen = false;

function ensureContainer() {
  if (!container) {
    container = document.createElement("div");
    container.id = "loading-root";
    document.body.appendChild(container);
    injectStyles();
  }
}

function injectStyles() {
  if (document.getElementById("loading-styles")) return;

  const style = document.createElement("style");
  style.id = "loading-styles";
  style.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,.65);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-card {
      background: white;
      padding: 24px 28px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,.12);
      display: flex;
      align-items: center;
      gap: 14px;
      animation: fade-in .2s ease;
    }

    .loading-spinner {
      width: 22px;
      height: 22px;
      border: 3px solid #e5e7eb;
      border-top-color: #ef4444;
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }

    @keyframes fade-in {
      from { opacity: 0; transform: scale(.96); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

export function showLoading(message = "Procesando…") {
  ensureContainer();
  if (isOpen) return;

  isOpen = true;

  container!.innerHTML = `
    <div class="loading-overlay">
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <p class="text-sm font-medium text-gray-700">${message}</p>
      </div>
    </div>
  `;
}

export function hideLoading() {
  if (!container || !isOpen) return;
  container.innerHTML = "";
  isOpen = false;
}
