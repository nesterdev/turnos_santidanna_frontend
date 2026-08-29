import CustomDatePicker from "../ui/CustomDatePicker";
import ShiftSelector from "../ui/ShiftSelector";
import EmployeeSelector from "../ui/EmployeeSelector";

export default function BulkManualMode({
  bulkData,
  setBulkData,
  employees,
  areas,
  shifts,
  loadingContext,
  canSelectArea,
}) {
  const operationalEmployees = employees.filter(
    (e) => e.role !== "admin" && e.role !== "ADMIN"
  );

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

  // Función para randomizar áreas a los empleados seleccionados sin áreas
  const handleRandomizeAreas = () => {
    setBulkData((prev) => {
      // Copiamos las asignaciones actuales y el listado de áreas ya tomadas globalmente
      let currentAssignments = [...prev.assignments];
      
      currentAssignments.forEach((assignment) => {
        // Solo actuamos sobre empleados que no tienen áreas seleccionadas
        if (!assignment.area_ids || assignment.area_ids.length === 0) {
          // Filtrar cuáles áreas están disponibles para este empleado en particular
          const currentGlobalTaken = currentAssignments.flatMap((a) => a.area_ids);
          
          const availableAreasForEmp = areas.filter((a) => {
            if (a.disabled) return false;
            if (currentGlobalTaken.includes(a.id)) return false;
            // Validar restricciones de compatibilidad o reglas del sistema
            const selectedObjects = areas.filter((x) => assignment.area_ids.includes(x.id));
            return canSelectArea(a, selectedObjects);
          });

          // Si hay áreas disponibles, barajamos y asignamos al menos una (o las que gustes, aquí asignamos una aleatoria por rapidez)
          if (availableAreasForEmp.length > 0) {
            // Shuffle aleatorio simple
            const randomArea = availableAreasForEmp[Math.floor(Math.random() * availableAreasForEmp.length)];
            assignment.area_ids = [randomArea.id];
          }
        }
      });

      return {
        ...prev,
        assignments: currentAssignments,
      };
    });
  };

  const selectedEmployeeIds = bulkData.assignments.map((a) => a.employee_id);

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <CustomDatePicker
          label="Fecha de Asignación:"
          value={bulkData.date}
          onChange={(val) => setBulkData((p) => ({ ...p, date: val }))}
        />
      </div>

      <ShiftSelector
        label="Turno General"
        shifts={shifts}
        selectedId={bulkData.shift_id}
        onChange={(id) => setBulkData((p) => ({ ...p, shift_id: id }))}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Selección y Asignación por Empleado
          </label>
          <div className="flex items-center gap-3">
            {loadingContext && (
              <p className="text-xs text-gray-400 animate-pulse">
                Validando disponibilidades...
              </p>
            )}
            {bulkData.assignments.length > 0 && (
              <button
                type="button"
                onClick={handleRandomizeAreas}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center gap-1.5 shadow-sm"
              >
                🎲 Asignar áreas al azar
              </button>
            )}
          </div>
        </div>

        {!bulkData.date && (
          <p className="text-xs text-gray-400 py-1 italic">
            Selecciona una fecha para verificar la disponibilidad de los empleados.
          </p>
        )}

        <EmployeeSelector
          label=""
          employees={operationalEmployees}
          selectedIds={selectedEmployeeIds}
          onSelect={toggleEmployee}
          multiple={true}
        />

        {/* Áreas por cada empleado seleccionado */}
        <div className="space-y-4 mt-4">
          {bulkData.assignments.map((assignment) => {
            const emp = operationalEmployees.find(
              (e) => e.id === assignment.employee_id
            );
            if (!emp || emp.disabled) return null;

            const selectedAreaIds = assignment.area_ids || [];

            return (
              <div
                key={emp.id}
                className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3"
              >
                <p className="text-xs font-bold text-gray-600 uppercase">
                  Áreas asignadas a <span className="text-[#FF3131]">{emp.name}</span>:
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
                        className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs transition-all ${
                          disabled
                            ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200"
                            : "cursor-pointer bg-white border-gray-200 hover:border-gray-300"
                        } ${
                          checked ? "border-[#FF3131] bg-red-50/10 font-medium" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleAreaForEmployee(emp.id, a.id)}
                          className="accent-[#FF3131] mt-0.5"
                        />
                        <div>
                          <p className="text-gray-800 font-medium">{a.name}</p>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}