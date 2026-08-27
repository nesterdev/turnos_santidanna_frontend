import React from "react";
import TabFilter from "./TabFilter";

export default function EmployeeSelector({
  employees = [],
  selectedIds = [],
  onSelect,
  multiple = false,
  filter = "all",
  onFilterChange,
  showFilters = false,
  label = "Empleado",
}) {
  const filteredEmployees = employees.filter((e) => {
    if (filter === "available") return !e.disabled;
    if (filter === "unavailable") return e.disabled;
    return true;
  });

  return (
    <div className="space-y-3">
      {(label || showFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-gray-100">
          {label && (
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {label}
            </label>
          )}

          {showFilters && onFilterChange && (
            <TabFilter
              size="sm"
              value={filter}
              onChange={onFilterChange}
              options={[
                { id: "all", label: "Todos" },
                { id: "available", label: "Disponibles" },
                { id: "unavailable", label: "No disponibles" },
              ]}
            />
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {filteredEmployees.map((e) => {
          const isSelected = selectedIds.includes(e.id);
          const isDisabled = !!e.disabled;

          return (
            <div
              key={e.id}
              onClick={() => !isDisabled && onSelect(e.id)}
              className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                  : "cursor-pointer hover:border-gray-300"
              } ${
                isSelected
                  ? "border-[#FF3131] bg-red-50/10 shadow-sm"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{e.name}</p>
                <p className="text-xs text-gray-500 capitalize">{e.role}</p>
                {isDisabled && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {e.reason || "No disponible"}
                  </p>
                )}
              </div>

              <input
                type={multiple ? "checkbox" : "radio"}
                checked={isSelected}
                disabled={isDisabled}
                readOnly
                className="accent-[#FF3131] w-4 h-4 cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}