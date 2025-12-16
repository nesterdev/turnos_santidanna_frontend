import React from "react";

interface ActionButtonProps {
  icon: string;
  alt: string;
  onClick: () => void; // opcional
  className?: string;
}

export default function DeleteButton({
  icon,
  alt,
  onClick,
  className = "",
}: ActionButtonProps) {
  const baseClasses =
    "px-3 py-1 rounded flex items-center justify-center transition hover:brightness-90";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={`${baseClasses} ${className}`}
    >
      <img src={icon} alt={alt} className="w-5 h-5" />
    </button>
  );
}
