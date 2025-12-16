export default function SelectCard({ title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl border transition
        ${
          active
            ? "border-black bg-black/5 shadow-sm"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }
      `}
    >
      <p className="text-sm font-medium text-gray-900">{title}</p>

      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </button>
  );
}