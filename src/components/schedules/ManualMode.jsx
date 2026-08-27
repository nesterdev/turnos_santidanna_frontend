import CustomDatePicker from "../ui/CustomDatePicker";
import ShiftSelector from "../ui/ShiftSelector";
import EmployeeSelector from "../ui/EmployeeSelector";

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
  return (
    <div className="space-y-6">
      <CustomDatePicker
        label="Fecha de asignación:"
        value={manualData.date}
        onChange={(val) => setManualData((p) => ({ ...p, date: val }))}
      />

      <EmployeeSelector
        label="Empleado"
        employees={manualEmployees}
        selectedIds={manualData.employee_id ? [manualData.employee_id] : []}
        onSelect={(id) => setManualData((p) => ({ ...p, employee_id: id }))}
        filter={employeeFilter}
        onFilterChange={setEmployeeFilter}
        showFilters={true}
      />

      {!manualData.date && (
        <p className="text-xs text-gray-400 py-1 italic">
          Selecciona una fecha primero para verificar disponibilidad.
        </p>
      )}

      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Áreas disponibles
        </label>
        {loadingAreas && (
          <p className="text-xs text-gray-400 animate-pulse">Cargando áreas…</p>
        )}

        <div className="grid sm:grid-cols-3 gap-3">
          {manualAreas.map((a) => {
            const checked = manualData.area_ids.includes(a.id);
            const selected = manualAreas.filter((x) =>
              manualData.area_ids.includes(x.id)
            );
            const disabled =
              a.disabled || (!checked && !canSelectArea(a, selected));

            return (
              <label
                key={a.id}
                className={`p-3 border rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                  disabled
                    ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                    : "hover:border-gray-300"
                } ${
                  checked
                    ? "border-[#FF3131] bg-red-50/10 shadow-sm"
                    : "bg-white border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-[#FF3131] mt-0.5"
                  disabled={disabled}
                  checked={checked}
                  onChange={() =>
                    setManualData((p) => ({
                      ...p,
                      area_ids: checked
                        ? p.area_ids.filter((id) => id !== a.id)
                        : [...p.area_ids, a.id],
                    }))
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {a.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Zona {a.zone} · Nivel {a.complexity_level}
                  </p>
                  {a.disabled && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {a.reason}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <ShiftSelector
        shifts={shifts}
        selectedId={manualData.shift_id}
        onChange={(id) => setManualData((p) => ({ ...p, shift_id: id }))}
      />
    </div>
  );
}