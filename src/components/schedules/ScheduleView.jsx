import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import DeleteButton from "../ui/deleteButtom";
import ActionButton from "../ui/ActionButtom";

export default function ScheduleView({ id }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deleteSchedule = async () => {
    const confirmed = await openConfirmModal({
      title: "Eliminar schedule",
      message:
        "Este turno será eliminado de forma permanente. Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/schedules/${id}`, { method: "DELETE" });
      window.location.href = "/schedules";
    } catch {
      alert("Error eliminando el schedule");
    }
  };

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await apiFetch(`/schedules/${id}`);
        if (res?.success) setSchedule(res.data);
        else setError(res?.message || "No se pudo cargar el schedule");
      } catch (err) {
        setError(err?.message || "No se pudo cargar el schedule");
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-28 bg-gray-100/60 rounded-2xl animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100/60 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100/60 rounded-2xl animate-pulse" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto bg-red-50/60 text-red-600 px-4 py-3 rounded-xl ring-1 ring-red-500/10">
        {error}
      </div>
    );

  if (!schedule) return null;

  const {
    id: scheduleId,
    date,
    created_at,
    is_replacement,
    ScheduleEmployee,
    ScheduleShift,
    ScheduleReplacements = [],
  } = schedule;

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* HEADER */}
      <header className="relative bg-white/80 backdrop-blur rounded-3xl px-8 py-6 ring-1 ring-black/5">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#FF3131]/40 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">
              Schedule #{scheduleId}
            </p>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {new Date(date).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Creado el{" "}
              {new Date(created_at).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium ring-1 ${
              is_replacement
                ? "bg-yellow-50 text-yellow-700 ring-yellow-200"
                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
            }`}
          >
            {is_replacement ? "Reemplazo" : "Asignación normal"}
          </span>
        </div>
      </header>

      {/* INFO */}
      <section className="grid md:grid-cols-2 gap-6">

        {/* EMPLEADO */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Empleado asignado
          </h3>

          <p className="text-xl font-medium text-gray-900">
            {ScheduleEmployee?.name}
          </p>
          <p className="text-sm text-gray-400">
            {ScheduleEmployee?.email}
          </p>

          <span
            className={`inline-flex mt-4 px-3 py-1 rounded-full text-xs font-medium ring-1 ${
              ScheduleEmployee?.active
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-red-50 text-red-600 ring-red-200"
            }`}
          >
            {ScheduleEmployee?.active ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* TURNO */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Detalles del turno
          </h3>

          <p className="text-xl font-medium text-gray-900">
            {ScheduleShift?.name}
          </p>
          <p className="text-sm text-gray-400">
            {ScheduleShift?.start_time} — {ScheduleShift?.end_time}
          </p>
        </div>
      </section>

      {/* REEMPLAZOS */}
      <section className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5">
        <h3 className="text-sm font-medium text-gray-500 mb-6">
          Historial de reemplazos
        </h3>

        {ScheduleReplacements.length === 0 ? (
          <p className="text-sm text-gray-400">
            No hay reemplazos registrados.
          </p>
        ) : (
          <div className="space-y-4">
            {ScheduleReplacements.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-2xl px-4 py-3 bg-gray-50/60 ring-1 ring-black/5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {r.ReplacementReplacer?.name} →{" "}
                    {r.ReplacementEmployee?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.reason || "Sin motivo"}
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <footer className="flex justify-end gap-3">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/schedules"
          className="bg-gray-100/70 hover:bg-gray-200/70"
        />
        <ActionButton
          icon="/edit.svg"
          alt="Editar"
          href={`/schedules/edit/${id}`}
          className="bg-[#FF3131]/10 hover:bg-[#FF3131]/20"
        />
        <DeleteButton
          icon="/delete.svg"
          alt="Eliminar"
          onClick={deleteSchedule}
          className="bg-red-100/70 text-red-600 hover:bg-red-200/70"
        />
      </footer>
    </div>
  );
}
