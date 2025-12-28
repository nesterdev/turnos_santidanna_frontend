export default function Button({
  text,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        bg-[#FF3131]
        hover:bg-[#FF3232]
        disabled:opacity-50
        disabled:cursor-not-allowed
        text-white
        w-full
        py-2
        rounded-md
        font-semibold
        transition
        cursor-pointer
        select-none
        touch-manipulation
        active:scale-95
      "
    >
      {text}
    </button>
  );
}
