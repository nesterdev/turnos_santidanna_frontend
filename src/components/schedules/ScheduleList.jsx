import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import Loading from "../ui/Loading";
import CustomDatePicker from "../ui/CustomDatePicker";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState(
    dayjs().tz("America/Bogota").format("YYYY-MM-DD")
  );

  useEffect(() => {
    loadSchedules(filterDate);
  }, [filterDate]);

  async function loadSchedules(date) {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch(`/schedules?start=${date}&end=${date}`);
      if (res?.success) setSchedules(res.data || []);
      else setError(res?.message || "No se pudieron cargar los horarios.");
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los horarios.");
    } finally {
      setLoading(false);
    }
  }

  const deleteSchedule = async (id) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar horario",
      message:
        "¿Deseas eliminar el turno de este empleado? Esta acción es irreversible.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/schedules/${id}`, { method: "DELETE" });
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error eliminando el horario");
    }
  };

  // Función para eliminar masivamente todos los horarios del día cargados en pantalla
  const deleteAllSchedulesForDay = async () => {
    if (schedules.length === 0) return;

    const confirmed = await openConfirmModal({
      title: "Eliminar todos los horarios",
      message: `¿Estás seguro de eliminar los ${schedules.length} turnos registrados para el día ${dayjs(filterDate).format("DD/MM/YYYY")}? Esta acción es irreversible.`,
      confirmText: "Eliminar todos",
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      // Disparamos todas las peticiones DELETE en paralelo de forma limpia
      await Promise.all(
        schedules.map((s) => apiFetch(`/schedules/${s.id}`, { method: "DELETE" }))
      );
      setSchedules([]);
    } catch (err) {
      alert("Ocurrió un error al intentar eliminar algunos horarios.");
      loadSchedules(filterDate); // Sincronizamos si hubo fallas parciales
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 px-2 sm:px-0">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 p-4 sm:p-7 space-y-6">
        
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Horarios
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Lista de horarios y asignaciones diarias
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CustomDatePicker
              value={filterDate}
              onChange={(newDate) => setFilterDate(newDate)}
              label="FECHA:"
            />

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              {schedules.length > 0 && (
                <button
                  type="button"
                  onClick={deleteAllSchedulesForDay}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition border border-red-200"
                >
                  🗑️ Eliminar todos del día
                </button>
              )}
              <a
                href="/schedules/create"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition"
              >
                + Nuevo Horario
              </a>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <Loading fullscreen={false} text="Cargando horarios…" />}

        {/* ALERTA ERROR */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && schedules.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto border border-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">No hay horarios para esta fecha</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Selecciona otra fecha o crea un nuevo registro.
              </p>
            </div>
          </div>
        )}

        {/* TABLA PRINCIPAL */}
        {!loading && schedules.length > 0 && (
          <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 whitespace-nowrap">USUARIO ASIGNADO</th>
                  <th className="pb-3 px-3 whitespace-nowrap">TURNO</th>
                  <th className="pb-3 px-3 whitespace-nowrap">ÁREAS</th>
                  <th className="pb-3 px-3 whitespace-nowrap">FECHA</th>
                  <th className="pb-3 px-3 text-right whitespace-nowrap">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-xs">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {s.ScheduleEmployee?.name || "N/A"}
                      </div>
                      
                      {(s.is_replacement || s.was_replaced) && s.OriginalEmployee && (
                        <span className="inline-flex items-center text-[10px] text-amber-600 font-medium mt-0.5">
                          ↳ Reemplaza a: {s.OriginalEmployee.name}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {s.is_rest_day ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
                          Descanso
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-600">
                          {s.ScheduleShift?.name || "Sin turno"}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 max-w-[150px] truncate">
                      {s.areas?.length
                        ? s.areas.map((a) => a.name).join(", ")
                        : "Sin asignar"}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        {dayjs(s.date).format("DD MMM YYYY")}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <ActionButton
                          icon="/eye.svg"
                          alt="Ver"
                          href={`/schedules/view?id=${s.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <ActionButton
                          icon="/edit.svg"
                          alt="Editar"
                          href={`/schedules/edit?id=${s.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <DeleteButton
                          icon="/delete.svg"
                          alt="Eliminar"
                          onClick={() => deleteSchedule(s.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}