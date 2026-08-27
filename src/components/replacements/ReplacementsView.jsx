import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";

export default function ReplacementsView() {
  const [replacement, setReplacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState(null);

  // 👇 LEER QUERY PARAM EN CLIENTE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    console.log("id leída desde URL:", empId);

    if (!empId) {
      setError("ID de reemplazo inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);

  useEffect(() => {
    if (!id) return;
    async function loadReplacement() {
      try {
        const res = await apiFetch(`/replacements/${id}`);
        console.log("respuesta replacements view:", res);

        if (res?.success) {
          setReplacement(res.data);
        } else {
          setError("No se pudo cargar el reemplazo");
        }
      } catch (err) {
        setError("Error cargando el reemplazo");
      } finally {
        setLoading(false);
      }
    }

    loadReplacement();
  }, [id]);

  async function deleteReplacement() {
    const confirmed = await openConfirmModal({
      title: "Eliminar reemplazo",
      message:
        "¿Deseas eliminar este reemplazo? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/replacements/${id}`, { method: "DELETE" });
      window.location.href = "/replacements";
    } catch (err) {
      alert("Error eliminando el reemplazo");
    }
  }

  if (loading)
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white/70 border border-gray-100 shadow-sm text-gray-500 animate-pulse text-center">
        Cargando reemplazo…
      </div>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 max-w-xl mx-auto text-center">
        {error}
      </p>
    );

  if (!replacement) return null;

  const {
    date,
    notes,
    status,
    created_at,
    ReplacementEmployee,
    ReplacementReplacer,
    ReplacementSchedule,
  } = replacement;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* HERO SECTION */}
      <div
        className="
          bg-white/90 backdrop-blur-xl
          rounded-2xl border border-gray-100
          shadow-sm
          p-8
        "
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                ID #{replacement.id}
              </span>
              <span
                className={`
                  inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize
                  ${
                    status === "pendiente"
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200/60"
                      : status === "aprobado"
                      ? "bg-green-50 text-green-700 border border-green-200/60"
                      : "bg-red-50 text-red-700 border border-red-200/60"
                  }
                `}
              >
                {status}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {ReplacementEmployee?.name || "Titular no asignado"}
              <span className="mx-3 text-gray-300 font-normal">→</span>
              {ReplacementReplacer?.name || "Reemplazo no asignado"}
            </h2>

            <p className="text-sm text-gray-500 mt-1.5">
              Sustitución programada para el día <span className="font-medium text-gray-800">{date}</span>
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* EMPLEADO TITULAR */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Empleado Titular
          </p>
          <div>
            <p className="text-base font-semibold text-gray-900">
              {ReplacementEmployee?.name || "—"}
            </p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">
              Rol: {ReplacementEmployee?.role || "—"} (ID: {replacement.employee_id})
            </p>
          </div>
        </div>

        {/* REEMPLAZO */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Personal de Reemplazo
          </p>
          <div>
            <p className="text-base font-semibold text-gray-900">
              {ReplacementReplacer?.name || "—"}
            </p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">
              Rol: {ReplacementReplacer?.role || "—"} (ID: {replacement.replaced_by})
            </p>
          </div>
        </div>

        {/* TURNO ASOCIADO */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2 sm:col-span-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Detalle del Turno Programado
          </p>
          {ReplacementSchedule ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Turno #{ReplacementSchedule.shift_id} <span className="text-gray-400 font-normal text-xs">(Prog. ID: {ReplacementSchedule.id})</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fecha del turno: {ReplacementSchedule.date}
                </p>
              </div>
              {ReplacementSchedule.ScheduleEmployee && (
                <div className="text-xs bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                  <span className="text-gray-400">Asignado original: </span>
                  <span className="font-medium text-gray-700">{ReplacementSchedule.ScheduleEmployee.name}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No hay información de turno vinculada</p>
          )}
        </div>
      </div>

      {/* NOTES CARD */}
      {notes && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-6 space-y-1.5">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Notas u Observaciones
          </p>
          <p className="text-sm text-gray-800 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100/60">
            {notes}
          </p>
        </div>
      )}

      {/* META INFO */}
      <p className="text-[11px] text-gray-400 text-center">
        Registro creado el {new Date(created_at).toLocaleString()}
      </p>

      {/* ACTIONS */}
      <div className="flex justify-center items-center gap-3 pt-2">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/replacements"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        />

        <ActionButton
          icon="/edit.svg"
          alt="Editar"
          href={`/replacements/edit?id=${id}`}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        />

        <DeleteButton
          icon="/delete.svg"
          alt="Eliminar"
          onClick={deleteReplacement}
          className="bg-red-50 text-red-600 hover:bg-red-100"
        />
      </div>
    </div>
  );
}