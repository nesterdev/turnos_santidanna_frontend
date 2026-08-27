// src/components/ui/Input.jsx
import React from "react";

export default function Input({
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  placeholder = "",
  disabled = false,
  hasError = false,
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      // IMPORTANTE: text-base en móviles (16px) evita el zoom automático en iOS
      className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-base sm:text-sm font-medium outline-none transition-all duration-200 ${
        hasError
          ? "border-red-400 bg-red-50/20 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300"
          : "border-gray-200 focus:bg-white focus:border-[#FF3131] focus:ring-4 focus:ring-red-500/10 text-gray-900"
      }`}
      {...props}
    />
  );
}