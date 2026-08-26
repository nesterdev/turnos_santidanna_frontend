import CustomDatePicker from "../ui/CustomDatePicker";

export default function ManualMode({
  manualData,
  setManualData,
  manualEmployees,
  manualAreas,
  shifts,
  loadingAreas,
  employeeFilter,
  setEmployeeFilter,
  canSelectArea,
}) {
  const filteredEmployees = manualEmployees.filter((e) => {
    if (employeeFilter === "available") return !e.disabled;
    if (employeeFilter === "unavailable") return e.disabled;
    return true;
  });

  return (
    <div className="space-y-6">
      <CustomDatePicker
        label="Fecha de asignación:"
        value={manualData.date}
        onChange={(val) => setManualData((p) => ({ ...p, date: val }))}
      />

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Empleado</label>
          <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl text-xs w-fit">
            {[
              { key: "all", label: "Todos" },
              { key: "available", label: "Disponibles" },
              { key: "unavailable", label: "No disponibles" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setEmployeeFilter(tab.key)}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  employeeFilter === tab.key ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!manualData.date && (
          <p className="text-xs text-gray-400 py-2 italic">Selecciona una fecha primero para cargar los empleados.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {filteredEmployees.map((e) => (
            <div
              key={e.id}
              onClick={() => !e.disabled && setManualData({ ...manualData, employee_id: e.id })}
              className={`card-option transition-all cursor-pointer ${
                manualData.employee_id === e.id ? "card-option-active border-[#FF3131]" : ""
              } ${e.disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{e.name}</p>
                <p className="text-xs text-gray-500">{e.role}</p>
                {e.disabled && <p className="text-xs text-red-500 mt-1 font-medium">{e.reason}</p>}
              </div>
              <input type="radio" checked={manualData.employee_id === e.id} disabled={e.disabled} readOnly className="accent-[#FF3131]" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Áreas disponibles</label>
        {loadingAreas && <p className="text-xs text-gray-400 animate-pulse">Cargando áreas…</p>}

        <div className="grid sm:grid-cols-3 gap-3">
          {manualAreas.map((a) => {
            const checked = manualData.area_ids.includes(a.id);
            const selected = manualAreas.filter((x) => manualData.area_ids.includes(x.id));
            const disabled = a.disabled || (!checked && !canSelectArea(a, selected));

            return (
              <label
                key={a.id}
                className={`card-option items-start gap-3 transition-all cursor-pointer ${
                  disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="checkbox mt-0.5 accent-[#FF3131]"
                  disabled={disabled}
                  checked={checked}
                  onChange={() =>
                    setManualData((p) => ({
                      ...p,
                      area_ids: checked ? p.area_ids.filter((id) => id !== a.id) : [...p.area_ids, a.id],
                    }))
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Zona {a.zone} · Nivel {a.complexity_level}</p>
                  {a.disabled && <p className="text-xs text-red-500 mt-1 font-medium">{a.reason}</p>}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Turno</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {shifts.map((s) => (
            <div
              key={s.id}
              onClick={() => setManualData((p) => ({ ...p, shift_id: s.id }))}
              className={`card-option transition-all cursor-pointer ${
                manualData.shift_id === s.id ? "card-option-active border-[#FF3131]" : ""
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.start_time} – {s.end_time}</p>
              </div>
              <input type="radio" checked={manualData.shift_id === s.id} readOnly className="accent-[#FF3131]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}