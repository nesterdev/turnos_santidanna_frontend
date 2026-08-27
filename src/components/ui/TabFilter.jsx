import React from "react";
import { motion } from "framer-motion";

export default function TabFilter({
  options = [],
  value,
  onChange,
  label = "",
  size = "md",
  fullWidth = false,
  className = "",
  layoutId = "tab-pill-indicator", // ID único para evitar colisiones si usas varios TabFilter en la misma pantalla
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { id: opt, label: opt } : opt
  );

  const sizeClasses = {
    sm: "px-3 py-1 text-xs font-semibold",
    md: "px-4 py-1.5 text-xs font-bold",
    lg: "px-5 py-2 text-sm font-bold",
  };

  const containerSizes = {
    sm: "p-1 rounded-xl gap-1",
    md: "p-1.5 rounded-2xl gap-1",
    lg: "p-1.5 rounded-2xl gap-1.5",
  };

  return (
    <div
      className={`flex items-center gap-2.5 ${
        fullWidth ? "w-full" : "w-fit"
      } ${className}`}
    >
      {label && (
        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider select-none pr-0.5">
          {label}
        </span>
      )}

      <div
        className={`relative flex items-center bg-gray-100/90 border border-gray-200/60 shadow-inner ${
          containerSizes[size]
        } ${fullWidth ? "w-full" : "w-fit"}`}
      >
        {normalizedOptions.map((opt) => {
          const isSelected = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative z-10 select-none transition-colors duration-200 focus:outline-none ${
                sizeClasses[size]
              } ${fullWidth ? "flex-1 text-center" : ""} ${
                isSelected
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {/* Pastilla flotante con animación Framer Motion */}
              {isSelected && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-200/80 -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}