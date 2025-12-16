import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

import DashboardKPIs from "./DashboardKPIs";
import DashboardTodayShifts from "./DashboardTodayShifts";
import DashboardPendingReplacements from "./DashboardPendingReplacements";
import DashboardEmployeesSummary from "./DashboardEmployeesSummary";
import DashboardShiftsStats from "./DashboardShiftsStats";
import DashboardReplacementsStats from "./DashboardReplacementsStats";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/dashboard/resumen");
        setData(res);
      } catch (e) {
        console.error("Error cargando dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Cargando dashboard...</p>;
  if (!data) return <p>Error cargando datos.</p>;

  // Transformamos empleados desde schedulesHoy para DashboardEmployeesSummary
  const empleados = data.schedulesHoy.map((s) => s.ScheduleEmployee);

  return (
    <div className="space-y-10">
      {/* KPIs principales */}
      <DashboardKPIs resumen={data.kpis} />

      {/* Resumen de empleados */}
      <DashboardEmployeesSummary employees={empleados} />

      {/* Estadísticas */}
      <DashboardShiftsStats schedules={data.schedulesHoy} />
      <DashboardReplacementsStats reemplazos={data.reemplazosPendientesData} />

      {/* Listados */}
      <DashboardTodayShifts schedules={data.schedulesHoy} />
      <DashboardPendingReplacements reemplazos={data.reemplazosPendientesData} />
    </div>
  );
}
