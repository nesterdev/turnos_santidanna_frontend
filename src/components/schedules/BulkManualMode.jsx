import { useState } from "react";
import CustomDatePicker from "../ui/CustomDatePicker";
import ShiftSelector from "../ui/ShiftSelector";
import EmployeeSelector from "../ui/EmployeeSelector";
import Button from "../ui/Button";

export default function BulkManualMode({
  bulkData,
  setBulkData,
  employees,
  areas,
  shifts,
  loadingContext,
  canSelectArea,
}) {
  // Estado local para controlar si la sección general de áreas está expandida o contraída
  const [isAssignmentsExpanded, setIsAssignmentsExpanded] = useState(false);

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

  const handleRandomizeAreas = () => {
    setBulkData((prev) => {
      let currentAssignments = [...prev.assignments];

      currentAssignments.forEach((assignment) => {
        if (!assignment.area_ids || assignment.area_ids.length === 0) {
          const currentGlobalTaken = currentAssignments.flatMap((a) => a.area_ids);

          const availableAreas = areas.filter((a) => {
            if (a.disabled) return false;
            if (a.is_manual) return false; // 🔥 EXCLUIMOS LAS ÁREAS MANUALES DE LA ASIGNACIÓN AL AZAR
            if (currentGlobalTaken.includes(a.id)) return false;

            const selectedObjects = areas.filter((x) => assignment.area_ids.includes(x.id));
            return canSelectArea(a, selectedObjects);
          });

          if (availableAreas.length > 0) {
            const areasWithoutYesterday = availableAreas.filter((a) => !a.worked_yesterday);
            const poolToChooseFrom = areasWithoutYesterday.length > 0 ? areasWithoutYesterday : availableAreas;

            const randomArea = poolToChooseFrom[Math.floor(Math.random() * poolToChooseFrom.length)];
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

  // Conteo total de áreas seleccionadas para mostrar en la cabecera del desplegable
  const totalAssignedAreasCount = bulkData.assignments.reduce(
    (acc, curr) => acc + (curr.area_ids?.length || 0),
    0
  );

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
              <Button
                type="button"
                onClick={handleRandomizeAreas}
                variant="outline"
                size="sm"
                icon="🎲"
                text="Asignar áreas al azar (Evitando repetición)"
              />
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

        {/* CONTENEDOR GENERAL CON DESPLEGABLE (ACORDEÓN) */}
        {bulkData.assignments.length > 0 && (
          <div className="border border-gray-200 rounded-2xl bg-gray-50/50 overflow-hidden transition-all mt-4">
            {/* Cabecera del desplegable general */}
            <div
              onClick={() => setIsAssignmentsExpanded(!isAssignmentsExpanded)}
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100/65 transition select-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700 uppercase">
                  Detalle de Áreas por Empleado
                </span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 font-medium">
                  Empleados seleccionados: <span className="text-[#FF3131] font-semibold">{bulkData.assignments.length}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600 shadow-sm">
                  {totalAssignedAreasCount} área(s) en total
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                    isAssignmentsExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Listado de empleados dentro del desplegable */}
            {isAssignmentsExpanded && (
              <div className="p-4 border-t border-gray-200 bg-white space-y-4">
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
                              <div className="w-full">
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-800 font-medium">{a.name}</p>
                                  {/* 🔥 ETIQUETA VISUAL PARA DIFERENCIAR LAS ÁREAS MANUALES / ESPECIALES */}
                                  {a.is_manual && (
                                    <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-md">
                                      Manual / Especial
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400">
                                  Z-{a.zone} · Nivel {a.complexity_level}
                                </p>
                                {takenByOther && (
                                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
                                    Asignada a otro empleado hoy
                                  </p>
                                )}
                                {!takenByOther && a.worked_yesterday && (
                                  <p className="text-[10px] text-amber-500 font-medium mt-0.5">
                                    ⚠️ Trabajó esta área ayer (Rotación sugerida)
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}