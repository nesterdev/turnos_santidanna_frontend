export default function DashboardTodayShifts({ schedules = [] }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-h-[180px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">Turnos de Hoy</h2>
        <span className="text-xs text-gray-400 font-medium">{schedules.length} asignados</span>
      </div>

      {schedules.length === 0 ? (
        <div className="p-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xs text-gray-400 font-medium">No hay turnos asignados hoy.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="pb-2">Empleado</th>
                <th className="pb-2">Turno</th>
                <th className="pb-2">Inicio</th>
                <th className="pb-2">Fin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {schedules.map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80">
                  <td className="py-3 font-medium text-gray-900">{s.ScheduleEmployee?.name || "N/A"}</td>
                  <td className="py-3 text-gray-600">{s.ScheduleShift?.name || "N/A"}</td>
                  <td className="py-3 text-gray-500">{s.ScheduleShift?.start_time || "--:--"}</td>
                  <td className="py-3 text-gray-500">{s.ScheduleShift?.end_time || "--:--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}