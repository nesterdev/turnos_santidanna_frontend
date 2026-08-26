import { useState } from "react";
import StatsOverview from "../../components/stats/StatsOverview.jsx";
import EmployeeStatsTable from "../../components/stats/EmployeeStatsTable.jsx";
import DateFilter from "../../components/stats/DateFilter.jsx";

export default function StatsPage() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [groupBy, setGroupBy] = useState("week");

  const handleFilterChange = (newRange, newGroupBy) => {
    setDateRange(newRange);
    if (newGroupBy) setGroupBy(newGroupBy);
  };

  return (
    <div className="space-y-6">
      {/* HEADER DEL MÓDULO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3131]"></span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Estadísticas
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Resumen de actividad y rendimiento de empleados
          </p>
        </div>

        <DateFilter onChange={handleFilterChange} />
      </div>

      {/* OVERVIEW (GRÁFICA RECHARTS) */}
      <StatsOverview dateRange={dateRange} groupBy={groupBy} />

      {/* TABLA DE DETALLES */}
      <EmployeeStatsTable dateRange={dateRange} groupBy={groupBy} />
    </div>
  );
}