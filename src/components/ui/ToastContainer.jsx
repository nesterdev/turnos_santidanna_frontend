import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToastContainer() {
  const [toast, setToast] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setQueue((prev) => [...prev, newToast]);
    };

    window.addEventListener("app:toast", handleToast);
    return () => window.removeEventListener("app:toast", handleToast);
  }, []);

  useEffect(() => {
    if (!toast && queue.length > 0) {
      const nextToast = queue[0];
      setToast(nextToast);
      setQueue((prev) => prev.slice(1));
    }
  }, [toast, queue]);

  const handleClose = () => {
    if (toast?.options?.onClose) {
      toast.options.onClose();
    }
    setToast(null);
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none flex flex-col items-end">
      <AnimatePresence mode="wait" onExitComplete={() => setToast(null)}>
        {toast && (
          <ToastCard key={toast.id} toast={toast} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onClose }) {
  const { type, message, options } = toast;
  const duration = options?.duration ?? (type === "loading" ? null : 2000);
  const closable = options?.closable ?? type !== "loading";

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const themes = {
    success: "bg-white/90 border-emerald-200 text-emerald-950 shadow-emerald-500/10",
    error: "bg-white/90 border-red-200 text-red-950 shadow-red-500/10",
    loading: "bg-white/90 border-blue-200 text-blue-950 shadow-blue-500/10",
  };

  const progressBg = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    loading: "bg-blue-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.8 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) onClose();
      }}
      className={`pointer-events-auto relative w-80 sm:w-96 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing ${themes[type]}`}
    >
      <div className="p-4 flex items-start gap-3.5">
        <div className="shrink-0 mt-0.5">
          <AnimatedIcon type={type} />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-bold text-xs uppercase tracking-wider opacity-80">
            {type === "success" ? "Éxito" : type === "error" ? "Error" : "Procesando"}
          </h4>
          <p className="text-sm font-medium mt-0.5 leading-snug break-words">
            {message}
          </p>
        </div>

        {closable && (
          <button
            onClick={onClose}
            className="shrink-0 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {duration && (
        <div className="h-1 w-full bg-slate-100/50 overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`h-full ${progressBg[type]}`}
          />
        </div>
      )}
    </motion.div>
  );
}

function AnimatedIcon({ type }) {
  if (type === "success") {
    return (
      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </motion.svg>
    </div>
  );
}