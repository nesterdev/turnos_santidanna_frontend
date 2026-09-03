export default function Button({
  text,
  children, // <- Añadimos esto para flexibilidad total
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  icon = null,
}) {
  const baseStyles = `
    inline-flex
    items-center
    justify-center
    font-semibold
    transition-all
    duration-200
    cursor-pointer
    select-none
    touch-manipulation
    active:scale-[0.98]
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:active:scale-100
  `;

  const variants = {
    primary: `bg-[#FF3131] hover:bg-[#e02828] text-white shadow-sm shadow-red-500/20`,
    secondary: `bg-gray-900 hover:bg-gray-800 text-white`,
    outline: `bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300`,
    ghost: `bg-transparent text-gray-600 hover:bg-gray-100`,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2 w-full",
    lg: "px-5 py-3 text-base rounded-xl gap-2.5 w-full",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {/* Si le pasas children (como el icono de carga), muestra eso; si no, muestra el texto */}
      {children || <span>{text}</span>}
    </button>
  );
}