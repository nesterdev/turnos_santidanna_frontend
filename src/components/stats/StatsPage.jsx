import { useState, useMemo } from "react";
import StatsOverview from "../../components/stats/StatsOverview.jsx";
import EmployeeStatsTable from "../../components/stats/EmployeeStatsTable.jsx";
import DateFilter from "../../components/stats/DateFilter.jsx";

export default function StatsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });

  const groupBy = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return "day";
    const diffDays =
      (new Date(dateRange.to) - new Date(dateRange.from)) /
      (1000 * 60 * 60 * 24);
    if (diffDays <= 1) return "day";
    if (diffDays <= 31) return "week";
    if (diffDays <= 365) return "month";
    return "year";
  }, [dateRange]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Estadísticas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Resumen de actividad y rendimiento de empleados
          </p>
        </div>

        <DateFilter onChange={setDateRange} />
      </div>

      {/* OVERVIEW */}
      <StatsOverview dateRange={dateRange} groupBy={groupBy} />

      {/* TABLE */}
      <EmployeeStatsTable dateRange={dateRange} groupBy={groupBy} />
    </div>
  );
}
