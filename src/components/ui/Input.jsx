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
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#FF3131] focus:ring-4 focus:ring-red-500/10 outline-none transition-all duration-200"
      {...props}
    />
  );
}