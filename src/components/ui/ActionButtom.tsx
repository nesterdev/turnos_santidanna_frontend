import React from "react";

interface ActionButtonProps {
  icon: string;
  alt: string;
  href: string; // opcional
  className?: string;
}

export default function ActionButton({
  icon,
  alt,
  href,
  className = "",
}: ActionButtonProps) {
  const baseClasses =
    "px-3 py-1 rounded flex items-center justify-center transition hover:brightness-90";

  return (
    <a href={href} className={`${baseClasses} ${className}`}>
      <img src={icon} alt={alt} className="w-5 h-5" />
    </a>
  );
}
