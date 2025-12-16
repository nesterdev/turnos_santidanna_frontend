export default function CreateButton({
  href,
  label = "Crear",
  className = "",
}) {
  return (
    <a
      href={href}
      className={`
        inline-flex items-center gap-2
        px-5 py-2.5 rounded-xl
        text-sm font-medium
        bg-black text-white
        shadow-sm
        hover:bg-gray-900 hover:shadow-md
        transition-all
        ${className}
      `}
    >
      <span className="text-base leading-none">+</span>
      {label}
    </a>
  );
}
