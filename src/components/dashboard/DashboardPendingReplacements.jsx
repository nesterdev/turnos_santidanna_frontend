export default function DashboardPendingReplacements({ reemplazos = [] }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-h-[180px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">Reemplazos Pendientes</h2>
        <span className="text-xs text-gray-400 font-medium">{reemplazos.length} en espera</span>
      </div>

      {reemplazos.length === 0 ? (
        <div className="p-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xs text-gray-400 font-medium">No hay reemplazos en espera.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="pb-2">Turno</th>
                <th className="pb-2">Empleado</th>
                <th className="pb-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reemplazos.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80">
                  <td className="py-3 font-medium text-gray-900">{r.ReplacementSchedule?.ScheduleShift?.name || "N/A"}</td>
                  <td className="py-3 text-gray-600">{r.ReplacementSchedule?.ScheduleEmployee?.name || "N/A"}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                      {r.status || "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}