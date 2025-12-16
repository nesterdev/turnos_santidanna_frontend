import { useState, useEffect } from "react";

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

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Rango</span>
      <select
        value={range}
        onChange={(e) => {
          setRange(e.target.value);
          onChange?.(computeDateRange(e.target.value));
        }}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#ff3131]/20"
      >
        <option value="day">Día</option>
        <option value="week">Semana</option>
        <option value="month">Mes</option>
        <option value="year">Año</option>
      </select>
    </div>
  );
}
