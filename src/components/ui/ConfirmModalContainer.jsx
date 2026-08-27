import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModalContainer() {
  const [modalData, setModalData] = useState(null);
  const activeResolver = useRef(null);

  useEffect(() => {
    const handleOpen = (e) => {
      if (modalData) return;
      activeResolver.current = e.detail.resolve;
      setModalData(e.detail);
    };

    window.addEventListener("app:confirm-modal", handleOpen);
    return () => window.removeEventListener("app:confirm-modal", handleOpen);
  }, [modalData]);

  const handleAction = (result) => {
    if (activeResolver.current) {
      activeResolver.current.result = result;
    }
    setModalData(null);
  };

  const handleExitComplete = () => {
    if (activeResolver.current) {
      activeResolver.current(activeResolver.current.result ?? false);
      activeResolver.current = null;
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={() => handleAction(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Tarjeta del Modal con corrección de renderizado tipográfico */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100/80 p-6 z-10 overflow-hidden transform-gpu"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 border border-red-100/80 flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug">
                  {modalData.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed antialiased">
                  {modalData.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end items-center gap-2.5 mt-6 pt-2">
              <button
                type="button"
                onClick={() => handleAction(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100/80 text-gray-700 text-xs font-bold hover:bg-gray-200/80 transition-colors cursor-pointer active:scale-95"
              >
                {modalData.cancelText || "Cancelar"}
              </button>

              <button
                type="button"
                onClick={() => handleAction(true)}
                className="px-5 py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer active:scale-95"
              >
                {modalData.confirmText || "Confirmar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}