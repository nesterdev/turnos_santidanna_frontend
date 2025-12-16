export default function Button({ text, type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#FF3131] hover:bg-[#FF3232] text-white w-full py-2 rounded-md font-semibold transition cursor-pointer"
    >
      {text}
    </button>
  );
}
