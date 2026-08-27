// src/components/ui/Field.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5 relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">{children}</div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {hint && !error && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
}