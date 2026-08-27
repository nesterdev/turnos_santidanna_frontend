import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function EmployeeStatsTable({ dateRange, groupBy }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!dateRange?.from || !dateRange?.to) return;
      setLoading(true);

      const res = await apiFetch(
        `/employees/stats?group_by=${groupBy}&from_date=${dateRange.from}&to_date=${dateRange.to}`
      );

      if (res?.success) setStats(res.data);
      else setStats([]);

      setLoading(false);
    }

    load();
  }, [dateRange, groupBy]);

  if (loading)
    return (
      <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
        <p className="text-xs font-semibold text-gray-400 animate-pulse">Cargando estadísticas…</p>
      </div>
    );

  if (!stats.length)
    return (
      <div className="p-10 bg-white border border-gray-100 rounded-2xl text-center shadow-sm">
        <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-xs font-semibold text-gray-500">No hay datos para el rango seleccionado</p>
      </div>
    );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Detalle por Empleado</h2>
        <span className="text-xs text-gray-400 font-semibold">{stats.length} registros</span>
      </div>

      {/* VISTA MÓVIL (Tarjetas con soporte de desbordamiento seguro) */}
      <div className="block sm:hidden divide-y divide-gray-100">
        {stats.map((e) => (
          <div key={e.employee_id} className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-black flex items-center justify-center text-xs shrink-0">
                  {e.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-tight truncate">{e.name}</p>
                  <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[9px] inline-block mt-0.5">
                    {e.role}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 block font-semibold uppercase">Días Trab.</span>
                <span className="text-sm font-extrabold text-gray-900">{e.total_days}</span>
              </div>
            </div>

            {(e.rest_days?.length > 0 || e.upcoming_rest?.length > 0) && (
              <div className="pt-2 border-t border-gray-50 text-[11px] space-y-1.5">
                {e.rest_days?.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-gray-400 font-medium">Descansos:</span>
                    {e.rest_days.map((d, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{d}</span>
                    ))}
                  </div>
                )}
                {e.upcoming_rest?.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-gray-400 font-medium">Próximos:</span>
                    {e.upcoming_rest.map((d, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 font-medium rounded text-[10px]">{d}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VISTA ESCRITORIO / TABLET (Tabla con scroll horizontal forzado) */}
      <div className="hidden sm:block w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-5 whitespace-nowrap">Empleado</th>
              <th className="py-3.5 px-5 whitespace-nowrap">Rol</th>
              <th className="py-3.5 px-5 whitespace-nowrap">Días Trabajados</th>
              <th className="py-3.5 px-5 whitespace-nowrap">Descansos</th>
              <th className="py-3.5 px-5 whitespace-nowrap">Próximos Descansos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats.map((e) => (
              <tr key={e.employee_id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-gray-900 flex items-center gap-3 whitespace-nowrap">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-black flex items-center justify-center text-[10px]">
                    {e.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[200px]" title={e.name}>{e.name}</span>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    {e.role}
                  </span>
                </td>
                <td className="py-3.5 px-5 font-extrabold text-gray-900 whitespace-nowrap">{e.total_days}</td>
                <td className="py-3.5 px-5 text-gray-500 font-medium whitespace-nowrap">
                  {e.rest_days?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {e.rest_days.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{d}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-gray-500 font-medium whitespace-nowrap">
                  {e.upcoming_rest?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {e.upcoming_rest.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 font-medium rounded text-[10px]">{d}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}