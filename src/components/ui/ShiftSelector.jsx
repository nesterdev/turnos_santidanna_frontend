export default function ShiftSelector({
  shifts = [],
  selectedId,
  onChange,
  label = "TURNO",
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}

      {shifts.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">No hay turnos disponibles.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {shifts.map((s) => {
            const isSelected = selectedId === s.id;
            const breakMinutes = Number(s.break_time) || 0;

            return (
              <div
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#FF3131] bg-red-50/20 shadow-sm ring-1 ring-[#FF3131]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {s.name}
                    </span>
                    {s.is_night && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Nocturno
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                  </p>

                  {breakMinutes > 0 ? (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Descanso: <strong className="text-gray-600 font-semibold">{breakMinutes} min</strong>
                    </p>
                  ) : (
                    <p className="text-[11px] text-gray-400">Sin descanso registrado</p>
                  )}
                </div>

                <input
                  type="radio"
                  name="shift_selection"
                  checked={isSelected}
                  onChange={() => onChange(s.id)}
                  className="h-4 w-4 accent-[#FF3131] cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}