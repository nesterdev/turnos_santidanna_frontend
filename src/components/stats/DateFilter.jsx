import { useState, useEffect } from "react";

const OPTIONS = [
  { id: "day", label: "Día" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
  { id: "year", label: "Año" },
];

export default function DateFilter({ onChange }) {
  const [range, setRange] = useState("week");

  const computeDateRange = (value) => {
    const today = new Date();
    let from, to;

    switch (value) {
      case "day":
        from = to = today;
        break;
      case "week":
        const day = today.getDay() || 7;
        from = new Date(today);
        from.setDate(today.getDate() - day + 1);
        to = new Date(from);
        to.setDate(from.getDate() + 6);
        break;
      case "month":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "year":
        from = new Date(today.getFullYear(), 0, 1);
        to = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        from = to = today;
    }

    const format = (d) => d.toISOString().slice(0, 10);
    return { from: format(from), to: format(to) };
  };

  useEffect(() => {
    onChange?.(computeDateRange(range));
  }, []);

  const handleSelect = (val) => {
    setRange(val);
    onChange?.(computeDateRange(val));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
        Rango
      </span>
      <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/60 w-full sm:w-auto overflow-x-auto">
        {OPTIONS.map((opt) => {
          const isActive = range === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}