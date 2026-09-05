import { useState, useEffect } from "react";
import { Smartphone, X } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("Usuario aceptó instalar la PWA");
    }
    
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FF3131] flex items-center justify-center shrink-0 text-white">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Instalar Aplicación</h4>
          <p className="text-xs text-slate-400">Instala Variedades Santidana en tu móvil para un acceso más rápido.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="px-3 py-2 bg-[#FF3131] hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
        >
          Instalar
        </button>
        <button
          onClick={() => setVisible(false)}
          className="p-1.5 text-slate-400 hover:text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}