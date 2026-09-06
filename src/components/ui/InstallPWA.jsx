import { useState, useEffect } from "react";
import { Smartphone, Share, PlusSquare, X } from "lucide-react";
import { registerPushNotifications } from "../../lib/api/push";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Detectar si la PWA ya está instalada (Standalone Mode en iOS y Android/Escritorio)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true;

    // Si ya está instalada, no mostramos nada bajo ninguna circunstancia
    if (isStandalone) {
      setVisible(false);
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const iosDevice = /ipad|iphone|ipod/.test(userAgent.toLowerCase());

    if (iosDevice) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    // 2. Evento nativo para Android / Chrome de escritorio
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
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("Usuario aceptó instalar la PWA");
      
      try {
        // Asegurarnos de pedir permisos y esperar al Service Worker antes de registrar las push
        if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            await navigator.serviceWorker.ready;
            await registerPushNotifications();
          }
        }
      } catch (err) {
        console.error("Error al registrar notificaciones post-instalación:", err);
      }
    }

    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Banner flotante principal */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3131] flex items-center justify-center shrink-0 text-white">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Instalar Aplicación
            </h4>
            <p className="text-xs text-slate-400">
              {isIOS 
                ? "Instala la app en tu iPhone para acceso rápido." 
                : "Instala Variedades Santidana en tu móvil."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3 py-2 bg-[#FF3131] hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            {isIOS ? "Ver cómo" : "Instalar"}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="p-1.5 text-slate-400 hover:text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de instrucciones específicas para iOS (Safari) */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 text-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-100">
                Instalar en iPhone (iOS)
              </h3>
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Safari de Apple no permite la instalación automática. Sigue estos 2 sencillos pasos para agregarla a tu pantalla de inicio:
            </p>

            <div className="space-y-4 text-xs text-slate-300 mb-6">
              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-full bg-[#FF3131]/20 text-[#FF3131] flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-white mb-0.5">Toca el botón Compartir</p>
                  <p className="text-slate-400 flex items-center gap-1">
                    Busca el ícono <Share className="w-4 h-4 inline text-blue-400 mx-0.5" /> en la barra inferior (o superior) de Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-full bg-[#FF3131]/20 text-[#FF3131] flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-white mb-0.5">Selecciona &quot;Añadir a pantalla de inicio&quot;</p>
                  <p className="text-slate-400 flex items-center gap-1">
                    Desplázate por el menú y busca la opción <PlusSquare className="w-4 h-4 inline text-slate-200 mx-0.5" /> <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-3 bg-[#FF3131] hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-wide cursor-pointer"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
}