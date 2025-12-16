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
      <div className="p-6 bg-white border rounded-xl shadow-sm text-gray-600">
        Cargando estadísticas…
      </div>
    );

  if (!stats.length)
    return (
      <div className="p-6 bg-gray-50 border rounded-xl text-gray-500">
        No hay datos para el rango seleccionado
      </div>
    );

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4 text-left">Empleado</th>
              <th className="p-4 text-left">Rol</th>
              <th className="p-4 text-left">Días</th>
              <th className="p-4 text-left">Descansos</th>
              <th className="p-4 text-left">Próximo</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((e) => (
              <tr
                key={e.employee_id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="p-4 font-medium text-gray-900">{e.name}</td>
                <td className="p-4 text-gray-600 capitalize">{e.role}</td>
                <td className="p-4">{e.total_days}</td>
                <td className="p-4 text-gray-600">
                  {e.rest_days?.join(", ") || "-"}
                </td>
                <td className="p-4 text-gray-600">
                  {e.upcoming_rest?.join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
