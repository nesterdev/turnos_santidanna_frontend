import React from "react";

interface ActionButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
  className?: string;
}

export default function DeleteButton({
  icon,
  alt,
  onClick,
  className = "",
}: ActionButtonProps) {
  const baseClasses =
    "px-2 sm:px-3 py-1 rounded-lg flex items-center justify-center transition hover:brightness-90 shrink-0";

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
      <img src={icon} alt={alt} className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
}