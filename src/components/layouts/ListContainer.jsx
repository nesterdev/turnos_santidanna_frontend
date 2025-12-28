import CreateButton from "../ui/CreateButton";

export default function ListContainer({
  title,
  description,
  createHref,
  createLabel = "Crear",
}) {
  return (
    <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {createHref && (
          <CreateButton href={createHref} label={createLabel} />
        )}
      </div>
    </div>
  );
}
