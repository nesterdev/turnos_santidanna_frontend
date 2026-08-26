import CustomDatePicker from "../ui/CustomDatePicker";

export default function BulkManualMode({
  bulkData,
  setBulkData,
  employees,
  areas,
  shifts,
  loadingContext,
  canSelectArea,
}) {
  // Excluir administradores
  const operationalEmployees = employees.filter(
    (e) => e.role !== "admin" && e.role !== "ADMIN"
  );

  // Obtener la lista global de áreas ya asignadas a cualquier empleado en este formulario
  const globallySelectedAreaIds = bulkData.assignments.flatMap(
    (a) => a.area_ids
  );

  const toggleEmployee = (empId) => {
    setBulkData((prev) => {
      const exists = prev.assignments.some((a) => a.employee_id === empId);
      return {
        ...prev,
        assignments: exists
          ? prev.assignments.filter((a) => a.employee_id !== empId)
          : [...prev.assignments, { employee_id: empId, area_ids: [] }],
      };
    });
  };

  const toggleAreaForEmployee = (empId, areaId) => {
    setBulkData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((item) => {
        if (item.employee_id !== empId) return item;
        const hasArea = item.area_ids.includes(areaId);
        return {
          ...item,
          area_ids: hasArea
            ? item.area_ids.filter((id) => id !== areaId)
            : [...item.area_ids, areaId],
        };
      }),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Selector de fecha única */}
      <div className="max-w-xs">
        <CustomDatePicker
          label="Fecha de Asignación:"
          value={bulkData.date}
          onChange={(val) => setBulkData((p) => ({ ...p, date: val }))}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Turno General
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {shifts.map((s) => (
            <div
              key={s.id}
              onClick={() => setBulkData((p) => ({ ...p, shift_id: s.id }))}
              className={`card-option transition-all cursor-pointer ${
                bulkData.shift_id === s.id
                  ? "card-option-active border-[#FF3131]"
                  : ""
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {s.start_time} – {s.end_time}
                </p>
              </div>
              <input
                type="radio"
                checked={bulkData.shift_id === s.id}
                readOnly
                className="accent-[#FF3131]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Selección y Asignación por Empleado
          </label>
          {loadingContext && (
            <p className="text-xs text-gray-400 animate-pulse">
              Validando disponibilidades...
            </p>
          )}
        </div>

        {!bulkData.date && (
          <p className="text-xs text-gray-400 py-2 italic">
            Selecciona una fecha para verificar la disponibilidad de los empleados.
          </p>
        )}

        <div className="space-y-4">
          {operationalEmployees.map((emp) => {
            const assignment = bulkData.assignments.find(
              (a) => a.employee_id === emp.id
            );
            const isSelected = !!assignment;
            const selectedAreaIds = assignment?.area_ids || [];

            return (
              <div
                key={emp.id}
                className={`p-4 border rounded-xl transition-all ${
                  isSelected
                    ? "border-[#FF3131] bg-red-50/10"
                    : "border-gray-200 bg-white"
                } ${
                  emp.disabled
                    ? "opacity-60 bg-gray-50/80 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <label
                    className={`flex items-center gap-3 ${
                      emp.disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={emp.disabled}
                      onChange={() => toggleEmployee(emp.id)}
                      className="accent-[#FF3131] rounded w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {emp.name}
                      </p>
                      <p className="text-xs text-gray-500">{emp.role}</p>
                      {emp.disabled && (
                        <p className="text-xs text-red-500 mt-0.5 font-medium">
                          {emp.reason || "No disponible para esta fecha"}
                        </p>
                      )}
                    </div>
                  </label>
                </div>

                {isSelected && !emp.disabled && (
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Áreas asignadas a {emp.name}:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {areas.map((a) => {
                        const checked = selectedAreaIds.includes(a.id);

                        const takenByOther =
                          !checked && globallySelectedAreaIds.includes(a.id);

                        const selectedAreasObj = areas.filter((x) =>
                          selectedAreaIds.includes(x.id)
                        );

                        const disabled =
                          a.disabled ||
                          takenByOther ||
                          (!checked && !canSelectArea(a, selectedAreasObj));

                        return (
                          <label
                            key={a.id}
                            className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${
                              disabled
                                ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200"
                                : "cursor-pointer"
                            } ${
                              checked
                                ? "border-[#FF3131] bg-white font-medium shadow-sm"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() =>
                                toggleAreaForEmployee(emp.id, a.id)
                              }
                              className="accent-[#FF3131] mt-0.5"
                            />
                            <div>
                              <p className="text-gray-800">{a.name}</p>
                              <p className="text-[10px] text-gray-400">
                                Z-{a.zone} · Nivel {a.complexity_level}
                              </p>
                              {takenByOther && (
                                <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
                                  Asignada a otro empleado
                                </p>
                              )}
                              {a.disabled && !takenByOther && (
                                <p className="text-[10px] text-red-500 font-medium mt-0.5">
                                  {a.reason}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}