import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import DeleteButton from "../ui/deleteButtom";
import ActionButton from "../ui/ActionButtom";

export default function ScheduleView() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    if (!empId) {
      setError("ID de schedule inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);

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
    if (!id) return;
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
    was_replaced,
    ScheduleEmployee,
    OriginalEmployee,
    ScheduleShift,
    ScheduleReplacements = [],
  } = schedule;

  const isReplacedShift = is_replacement || was_replaced || !!OriginalEmployee;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <header className="relative bg-white/80 backdrop-blur rounded-3xl px-8 py-6 ring-1 ring-black/5">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#FF3131]/40 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">
              Schedule #{scheduleId}
            </p>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight capitalize">
              {new Date(date).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Creado el {new Date(created_at).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium ring-1 ${
              isReplacedShift
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
            }`}
          >
            {isReplacedShift ? "Turno Reemplazado" : "Asignación Normal"}
          </span>
        </div>
      </header>

      {/* SECCIÓN INFORMACIÓN GENERAL */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* EMPLEADO ACTUAL */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Empleado asignado hoy (Cubre el turno)
            </h3>
            <p className="text-xl font-medium text-gray-900">
              {ScheduleEmployee?.name || "Sin asignar"}
            </p>
            <p className="text-sm text-gray-400">
              {ScheduleEmployee?.email || "Sin correo"}
            </p>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ring-1 ${
                ScheduleEmployee?.active
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-red-50 text-red-600 ring-red-200"
              }`}
            >
              {ScheduleEmployee?.active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* EMPLEADO ORIGINAL (SI HUBO REEMPLAZO) O TURNO */}
        {OriginalEmployee ? (
          <div className="bg-amber-50/40 backdrop-blur rounded-3xl p-6 ring-1 ring-amber-200/60 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-700 mb-4">
                Empleado Original (Ausente)
              </h3>
              <p className="text-xl font-medium text-gray-900">
                {OriginalEmployee.name}
              </p>
              <p className="text-sm text-gray-500">
                {OriginalEmployee.email}
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 ring-1 ring-amber-200">
                Titular del turno
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Detalles del turno
            </h3>
            <p className="text-xl font-medium text-gray-900">
              {ScheduleShift?.name || "Sin Nombre"}
            </p>
            <p className="text-sm text-gray-400">
              {ScheduleShift?.start_time} — {ScheduleShift?.end_time}
            </p>
          </div>
        )}
      </section>

      {/* HORARIOS DEL TURNO (SI EXISTE EMPLEADO ORIGINAL EN LA SECCIÓN ANTERIOR) */}
      {OriginalEmployee && (
        <section className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Detalles del turno asignado
          </h3>
          <p className="text-xl font-medium text-gray-900">
            {ScheduleShift?.name || "Sin Nombre"}
          </p>
          <p className="text-sm text-gray-400">
            Horario: {ScheduleShift?.start_time} — {ScheduleShift?.end_time}
          </p>
        </section>
      )}

      {/* HISTORIAL DE REEMPLAZOS */}
      <section className="bg-white/80 backdrop-blur rounded-3xl p-6 ring-1 ring-black/5">
        <h3 className="text-sm font-medium text-gray-500 mb-6">
          Historial de auditoría del turno
        </h3>

        {ScheduleReplacements.length === 0 ? (
          <p className="text-sm text-gray-400">
            No hay registros en la bitácora de reemplazos.
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
                    Reemplazante: <span className="text-emerald-700">{r.ReplacementReplacer?.name}</span> → Ausente: <span className="text-amber-700">{r.ReplacementEmployee?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Motivo: {r.notes || "Sin motivo registrado"}
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

      {/* BOTONES DE ACCIÓN */}
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
          href={`/schedules/edit?id=${id}`}
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