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

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm text-center p-8 my-6">
        <div className="w-12 h-12 bg-red-50 text-[#FF3131] rounded-xl flex items-center justify-center mb-4 border border-red-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900">No se pudieron sincronizar las métricas</h3>
        <p className="text-xs text-gray-500 mt-1 mb-5">Ocurrió un problema al consultar la API del sistema.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FF3131] text-white font-medium text-xs rounded-lg hover:bg-red-600 transition-all shadow-sm"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  const kpis = data.kpis || {};
  const empleadosSummary = data.empleadosSummary || {};
  const schedulesHoy = data.schedulesHoy || [];
  const reemplazosPendientesData = data.reemplazosPendientesData || [];

  const hoyFormatted = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Banner Principal / Saludo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight">Panel de Control</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Activo
            </span>
          </div>
          <p className="text-xs text-gray-300 capitalize mt-1">{hoyFormatted}</p>
        </div>
      </div>

      {/* KPIs Rápidos */}
      <DashboardKPIs resumen={kpis} />

      {/* Contenido Principal en Grid de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Métricas de Personal y Estadísticas */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardEmployeesSummary employees={empleadosSummary} />
          <DashboardShiftsStats schedules={schedulesHoy} />
          <DashboardReplacementsStats reemplazos={reemplazosPendientesData} />
        </div>

        {/* Columna Derecha: Listados Operativos (Turnos y Reemplazos) */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardTodayShifts schedules={schedulesHoy} />
          <DashboardPendingReplacements reemplazos={reemplazosPendientesData} />
        </div>

      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse pb-10">
      <div className="h-24 bg-gray-200/70 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 bg-gray-200/70 rounded-2xl" />
        <div className="h-28 bg-gray-200/70 rounded-2xl" />
        <div className="h-28 bg-gray-200/70 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-gray-200/70 rounded-2xl" />
        <div className="lg:col-span-2 h-80 bg-gray-200/70 rounded-2xl" />
      </div>
    </div>
  );
}