import { useState, useEffect } from "react";
import { registerPushNotifications } from "../../lib/api/push";

export default function PushNotificationManager() {
  const [statusMessage, setStatusMessage] = useState("");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsStandalone(isInStandaloneMode);

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsIOSDevice(/ipad|iphone|ipod/.test(userAgent.toLowerCase()));
  }, []);

  const handleEnablePush = async () => {
    try {
      setStatusMessage("Solicitando permisos y registrando dispositivo...");

      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        setStatusMessage("Tu navegador no soporta notificaciones o Service Workers.");
        return;
      }

      // Llamamos directamente a la función unificada de tu API. 
      // Ella misma pide permisos, maneja el SW y hace el POST al backend.
      await registerPushNotifications();

      setStatusMessage("¡Dispositivo iOS registrado con éxito para notificaciones! 🎉");
    } catch (err) {
      console.error("Error detallado al activar notificaciones:", err);
      // Ahora sí verás el error real en pantalla si el POST al backend falla
      setStatusMessage(`Error: ${err.message || "Revisa la consola para más detalles."}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
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
            <h3 className="text-sm font-bold text-slate-900">
              Notificaciones Push
            </h3>
            <p className="text-xs text-slate-400">
              Mantente al día con tus turnos y alertas operativas.
            </p>
          </div>
        </div>
      </div>

      {!isStandalone && isIOSDevice && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2.5">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <strong className="font-bold">Aviso importante en iOS:</strong>{" "}
            Estás abriendo la app desde el navegador. Para que las
            notificaciones push funcionen, debes abrir la app directamente desde
            el ícono en tu{" "}
            <b className="font-semibold text-slate-900">Pantalla de inicio</b>.
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          onClick={handleEnablePush}
          className="w-full py-3 px-5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Activar Notificaciones en este Dispositivo
        </button>
      </div>

      {statusMessage && (
        <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium animate-fadeIn">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
