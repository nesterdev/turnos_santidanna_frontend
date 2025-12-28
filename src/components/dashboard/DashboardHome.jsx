import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

import DashboardKPIs from "./DashboardKPIs";
import DashboardTodayShifts from "./DashboardTodayShifts";
import DashboardPendingReplacements from "./DashboardPendingReplacements";
import DashboardEmployeesSummary from "./DashboardEmployeesSummary";
import DashboardShiftsStats from "./DashboardShiftsStats";
import DashboardReplacementsStats from "./DashboardReplacementsStats";
import Loading from "../ui/Loading";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/dashboard/resumen");
        console.log("respuesta de dashboard",res)
        setData(res);
      } catch (e) {
        console.error("Error cargando dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading fullscreen text="Cargando datos…" />
  if (!data) return <p>Error cargando datos.</p>;

  return (
    <div className="space-y-10">
      {/* KPIs principales */}
      <DashboardKPIs resumen={data.kpis} />

      {/* Resumen de empleados */}
      <DashboardEmployeesSummary employees={data.empleadosSummary} />

      {/* Estadísticas */}
      <DashboardShiftsStats schedules={data.schedulesHoy} />
      <DashboardReplacementsStats reemplazos={data.reemplazosPendientesData} />

      {/* Listados */}
      <DashboardTodayShifts schedules={data.schedulesHoy} />
      <DashboardPendingReplacements reemplazos={data.reemplazosPendientesData} />
    </div>
  );
}
