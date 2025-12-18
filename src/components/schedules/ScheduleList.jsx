import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import CreateButton from "../ui/CreateButton";

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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-end px-6 pt-6 pb-4">
        <CreateButton href="/schedules/create" label="Nuevo Horario" />
      </div>
      {/* HEADER / FILTER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Horarios</h2>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Fecha</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#ff3131]/20"
          />
        </div>
      </div>

      {/* STATES */}
      {loading && (
        <div className="p-6 bg-white border rounded-xl shadow-sm text-gray-600">
          Cargando horarios…
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {!loading && !schedules.length && (
        <div className="p-6 bg-gray-50 border rounded-xl text-center text-gray-500">
          No hay horarios para esta fecha
        </div>
      )}

      {/* TABLE */}
      {schedules.length > 0 && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Empleado</th>
                  <th className="p-4 text-left">Turno</th>
                  <th className="p-4 text-left">Áreas</th>
                  <th className="p-4 text-left">Fecha</th>
                  <th className="p-4 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-gray-500">{s.id}</td>

                    <td className="p-4 font-medium text-gray-900">
                      {s.ScheduleEmployee?.name || "N/A"}
                    </td>

                    <td className="p-4">
                      {s.is_rest_day ? (
                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                          Descanso
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                          {s.ScheduleShift?.name || "Sin turno"}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {s.areas?.length
                        ? s.areas.map((a) => a.name).join(", ")
                        : "Sin asignar"}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                        {dayjs(s.date).format("DD MMM YYYY")}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon="/eye.svg"
                          alt="Ver"
                          href={`/schedules/view?id=${s.id}`}
                          className="bg-gray-100 hover:bg-gray-200"
                        />

                        <ActionButton
                          icon="/edit.svg"
                          alt="Editar"
                          href={`/schedules/edit?id=${s.id}`}
                          className="bg-blue-100 hover:bg-blue-200"
                        />

                        <DeleteButton
                          icon="/delete.svg"
                          alt="Eliminar"
                          onClick={() => deleteSchedule(s.id)}
                          className="bg-red-100 hover:bg-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE HINT */}
          <div className="md:hidden text-xs text-gray-400 px-4 py-2 border-t">
            Desliza horizontalmente para ver más columnas →
          </div>
        </div>
      )}
    </div>
  );
}
