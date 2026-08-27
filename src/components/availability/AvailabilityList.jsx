// src/components/availability/AvailabilityList.jsx
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import Loading from "../ui/Loading";
import TabFilter from "../ui/TabFilter"; // Importamos el componente selector

const daysMap = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  0: "Domingo",
};

const shortDaysMap = {
  1: "L",
  2: "M",
  3: "M",
  4: "J",
  5: "V",
  6: "S",
  0: "D",
};

// Función para formatear fechas a texto amigable (Ej: "25 Ago, 2026")
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Función para calcular la fecha exacta sumando días a week_start
function getExactDate(weekStartStr, dayOfWeek) {
  if (!weekStartStr) return "";
  const [year, month, day] = weekStartStr.split("T")[0].split("-");
  const baseDate = new Date(year, month - 1, day);

  const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  baseDate.setDate(baseDate.getDate() + dayOffset);

  return baseDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export default function AvailabilityList() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await apiFetch("/availability");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setAvailability(list);
    } catch {
      setError("No se pudo cargar la disponibilidad.");
    } finally {
      setLoading(false);
    }
  }

  // Extraer las semanas únicas disponibles para el filtro
  const availableWeeks = useMemo(() => {
    const weeksSet = new Set();
    availability.forEach((item) => {
      if (item.week_start) weeksSet.add(item.week_start.split("T")[0]);
    });
    return Array.from(weeksSet).sort();
  }, [availability]);

  // Formatear las semanas para el componente TabFilter
  const weekTabOptions = useMemo(() => {
    const defaultOption = { id: "ALL", label: "Todas las semanas" };
    const dynamicOptions = availableWeeks.map((week) => ({
      id: week,
      label: `Semana del ${formatDate(week)}`,
    }));
    return [defaultOption, ...dynamicOptions];
  }, [availableWeeks]);

  // Agrupar por EMPLEADO y por SEMANA
  const groupedData = useMemo(() => {
    const groups = {};

    availability.forEach((item) => {
      const week = item.week_start ? item.week_start.split("T")[0] : "sin-semana";

      // Aplicar filtro de semana seleccionada
      if (selectedWeek !== "ALL" && week !== selectedWeek) return;

      const empId = item.AvailabilityEmployee?.id || item.employee_id || "desconocido";
      const key = `${empId}_${week}`;

      if (!groups[key]) {
        groups[key] = {
          key,
          employeeId: empId,
          employeeName: item.AvailabilityEmployee?.name || "Empleado desconocido",
          employeeRole: item.AvailabilityEmployee?.role || "Trabajador",
          weekStart: week,
          records: [],
        };
      }
      groups[key].records.push(item);
    });

    // Ordenar los registros internamente por día de la semana (Lunes a Domingo)
    Object.values(groups).forEach((group) => {
      group.records.sort((a, b) => {
        const orderA = a.day_of_week === 0 ? 7 : a.day_of_week;
        const orderB = b.day_of_week === 0 ? 7 : b.day_of_week;
        return orderA - orderB;
      });
    });

    return Object.values(groups);
  }, [availability, selectedWeek]);

  async function deleteAvailability(id) {
    const confirmed = await openConfirmModal({
      title: "Eliminar disponibilidad",
      message: "Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/availability/${id}`, { method: "DELETE" });
      setAvailability((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error eliminando la disponibilidad");
    }
  }

  const toggleExpand = (key) => {
    setExpandedCard(expandedCard === key ? null : key);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 p-7 space-y-6">
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Disponibilidad
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Gestión de días y restricciones de horario organizadas por semana y empleado
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* TAB FILTER POR SEMANA */}
            {availableWeeks.length > 0 && (
              <TabFilter
                options={weekTabOptions}
                value={selectedWeek}
                onChange={setSelectedWeek}
                size="sm"
                layoutId="availability-week-filter"
              />
            )}

            <a
              href="/availability/create"
              className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              + Nueva disponibilidad
            </a>
          </div>
        </div>

        {/* ESTADO DE CARGA */}
        {loading && <Loading fullscreen={false} text="Cargando disponibilidad…" />}

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && groupedData.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto border border-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">No hay registros de disponibilidad</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                No hay resultados para el filtro seleccionado.
              </p>
            </div>
          </div>
        )}

        {/* LISTA AGRUPADA POR EMPLEADO Y SEMANA */}
        {!loading && groupedData.length > 0 && (
          <div className="space-y-3">
            {groupedData.map((group) => {
              const isExpanded = expandedCard === group.key;

              return (
                <div
                  key={group.key}
                  className="border border-gray-100 rounded-xl overflow-hidden bg-white transition-all shadow-sm hover:border-gray-200"
                >
                  {/* VISTA PREVIA DEL EMPLEADO Y FECHA */}
                  <div
                    onClick={() => toggleExpand(group.key)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    {/* INFO EMPLEADO Y SEMANA */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {group.employeeName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">
                            {group.employeeName}
                          </h3>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                            Semana del {formatDate(group.weekStart)}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Rol: <span className="capitalize">{group.employeeRole}</span> • {group.records.length} días configurados
                        </p>
                      </div>
                    </div>

                    {/* VISTA RÁPIDA DE DÍAS (MINI BADGES) & BOTÓN */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                      {/* CÍRCULOS DE DÍAS (Semanas L-D) */}
                      <div className="flex items-center gap-1">
                        {group.records.map((rec) => (
                          <div
                            key={rec.id}
                            title={`${daysMap[rec.day_of_week]}: ${rec.available ? "Disponible" : rec.notes || "No disponible"}`}
                            className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                              rec.available
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                            }`}
                          >
                            {shortDaysMap[rec.day_of_week]}
                          </div>
                        ))}
                      </div>

                      {/* BOTÓN EXPANDIR */}
                      <button className="text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1.5 bg-gray-100/80 hover:bg-gray-200/70 px-3 py-1.5 rounded-xl transition">
                        <span>{isExpanded ? "Ocultar" : "Detalles"}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* TABLA DETALLADA EXPANDIDA */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/40 p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              <th className="pb-2 px-3">DÍA Y FECHA</th>
                              <th className="pb-2 px-3">ESTADO</th>
                              <th className="pb-2 px-3">NOTAS / RESTRICCIÓN</th>
                              <th className="pb-2 px-3 text-right">ACCIONES</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs">
                            {group.records.map((a) => (
                              <tr key={a.id} className="hover:bg-white transition-colors">
                                <td className="py-2.5 px-3 font-semibold text-gray-800">
                                  {daysMap[a.day_of_week]}
                                  <span className="text-[11px] text-gray-400 font-normal ml-1.5">
                                    ({getExactDate(a.week_start, a.day_of_week)})
                                  </span>
                                </td>

                                <td className="py-2.5 px-3">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                      a.available
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                                        : "bg-red-50 text-red-600 border border-red-100/50"
                                    }`}
                                  >
                                    {a.available ? "Disponible" : "No disponible"}
                                  </span>
                                </td>

                                <td className="py-2.5 px-3 text-gray-500 max-w-xs truncate">
                                  {a.notes ? (
                                    <span className="text-gray-700 font-medium">{a.notes}</span>
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>

                                <td className="py-2.5 px-3 text-right">
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    <ActionButton
                                      icon="/eye.svg"
                                      alt="Ver"
                                      href={`/availability/view?id=${a.id}`}
                                      className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    />
                                    <ActionButton
                                      icon="/edit.svg"
                                      alt="Editar"
                                      href={`/availability/edit?id=${a.id}`}
                                      className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    />
                                    <DeleteButton
                                      icon="/delete.svg"
                                      alt="Eliminar"
                                      onClick={() => deleteAvailability(a.id)}
                                      className="bg-red-50 text-red-600 hover:bg-red-100"
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}