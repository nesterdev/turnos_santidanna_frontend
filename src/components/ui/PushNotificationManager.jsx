import { useState, useEffect } from "react";
import { registerPushNotifications } from "../../lib/api/push";

export default function PushNotificationManager() {
  const [statusMessage, setStatusMessage] = useState("");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const savedPushStatus = localStorage.getItem("push_notifications_subscribed");
    if (savedPushStatus === "true") {
      setIsSubscribed(true);
    }

    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsStandalone(isInStandaloneMode);

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const ios = /ipad|iphone|ipod/.test(userAgent.toLowerCase());
    const android = /android/.test(userAgent.toLowerCase());
    
    setIsIOSDevice(ios);
    setIsMobileDevice(ios || android);
  }, []);

  // Si no es un dispositivo móvil (celular/tablet) o ya se suscribió, ocultamos el componente
  if (!isMobileDevice || isSubscribed) {
    return null; 
  }

  const handleEnablePush = async () => {
    try {
      setStatusMessage("Solicitando permisos y registrando dispositivo...");

      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        setStatusMessage("Tu navegador no soporta notificaciones o Service Workers.");
        return;
      }

      await registerPushNotifications();
      
      localStorage.setItem("push_notifications_subscribed", "true");
      
      setStatusMessage("¡Dispositivo registrado con éxito para notificaciones! 🎉");

      setTimeout(() => {
        setIsSubscribed(true);
      }, 2000);

    } catch (err) {
      console.error("Error detallado al activar notificaciones:", err);
      setStatusMessage(`Error: ${err.message || "Revisa la consola."}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200/85 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Notificaciones Push</h3>
            <p className="text-xs text-slate-400">Mantente al día con tus turnos y alertas.</p>
          </div>
        </div>
      </div>

      {!isStandalone && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2.5">
          <span>⚠️</span>
          <div>
            <strong className="font-bold">Aviso importante:</strong> Para una mejor experiencia, recuerda añadir la app a tu <b>Pantalla de inicio</b> {isIOSDevice ? "desde Safari" : "desde el menú de tu navegador"}.
          </div>
        </div>
      )}

      <button
        onClick={handleEnablePush}
        className="w-full py-3 px-5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer transition-all active:scale-95"
      >
        Activar Notificaciones
      </button>

      {statusMessage && (
        <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
          {statusMessage}
        </p>
      )}
    </div>
  );
}