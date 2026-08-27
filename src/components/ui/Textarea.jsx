// src/components/ui/Textarea.jsx
import React from "react";

export default function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder = "",
  disabled = false,
  hasError = false,
  ...props
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-medium outline-none transition-all duration-200 resize-none ${
        hasError
          ? "border-red-400 bg-red-50/20 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300"
          : "border-gray-200 focus:bg-white focus:border-[#FF3131] focus:ring-4 focus:ring-red-500/10 text-gray-900"
      }`}
      {...props}
    />
  );
}