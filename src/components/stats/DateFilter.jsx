import { useState, useEffect } from "react";
import TabFilter from "../ui/TabFilter";

const OPTIONS = [
  { id: "day", label: "Día", groupBy: "day" },
  { id: "week", label: "Semana", groupBy: "day" },
  { id: "month", label: "Mes", groupBy: "week" },
  { id: "year", label: "Año", groupBy: "month" },
];

export default function DateFilter({ onChange }) {
  const [range, setRange] = useState("week");

  const computeFilterData = (optionId) => {
    const today = new Date();
    let from, to;

    const selectedOption = OPTIONS.find((opt) => opt.id === optionId) || OPTIONS[1];

    switch (optionId) {
      case "day":
        from = to = today;
        break;
      case "week": {
        const day = today.getDay() || 7;
        from = new Date(today);
        from.setDate(today.getDate() - day + 1);
        to = new Date(from);
        to.setDate(from.getDate() + 6);
        break;
      }
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

    const format = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      dateRange: { from: format(from), to: format(to) },
      groupBy: selectedOption.groupBy,
    };
  };

  useEffect(() => {
    const data = computeFilterData(range);
    onChange?.(data.dateRange, data.groupBy);
  }, []);

  const handleSelect = (val) => {
    setRange(val);
    const data = computeFilterData(val);
    onChange?.(data.dateRange, data.groupBy);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
        Rango
      </span>
      <TabFilter
        size="sm"
        value={range}
        onChange={handleSelect}
        options={OPTIONS}
      />
    </div>
  );
}