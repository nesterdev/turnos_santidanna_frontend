export default function DashboardShiftsStats({ schedules = [] }) {
  const total = schedules.length;
  const porTurno = schedules.reduce((acc, s) => {
    const t = s.ScheduleShift?.name ?? "Sin Turno";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 mb-4">Estadísticas de Turnos</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs font-medium text-gray-600">Total turnos hoy</span>
          <span className="text-base font-bold text-gray-900">{total}</span>
        </div>

        {Object.keys(porTurno).length > 0 && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            {Object.entries(porTurno).map(([turno, count]) => (
              <div key={turno} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{turno}</span>
                <span className="font-semibold text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}