import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";

export default function ReplacementsView({ id }) {
  const [replacement, setReplacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
      <p className="text-sm text-gray-500 max-w-xl mx-auto">
        Cargando reemplazo…
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 max-w-xl mx-auto">
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* HERO */}
      <div
        className="
      bg-white/80 backdrop-blur-xl
      rounded-2xl border border-gray-100
      shadow-sm
      p-8
    "
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {ReplacementEmployee?.name}
              <span className="mx-2 text-gray-400">→</span>
              {ReplacementReplacer?.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Reemplazo asignado para el día {date}
            </p>
          </div>

          <span
            className={`
          inline-flex px-3 py-1 rounded-full text-xs font-medium
          ${
            status === "pendiente"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }
        `}
          >
            {status}
          </span>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard label="Fecha" value={date} />

        <InfoCard
          label="Turno"
          value={
            ReplacementSchedule
              ? `Turno #${ReplacementSchedule.shift_id}`
              : "No especificado"
          }
          sub={ReplacementSchedule ? ReplacementSchedule.date : null}
        />
      </div>

      {/* NOTES */}
      {notes && (
        <div
          className="
        bg-white/80 backdrop-blur-xl
        rounded-2xl border border-gray-100
        shadow-sm
        p-6
      "
        >
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Notas
          </p>
          <p className="text-sm text-gray-800 leading-relaxed">{notes}</p>
        </div>
      )}

      {/* META */}
      <p className="text-xs text-gray-400 text-center">
        Creado el {new Date(created_at).toLocaleString()}
      </p>

      {/* ACTIONS */}
      <div className="flex justify-center gap-3 pt-2">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/replacements"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        />

        <ActionButton
          icon="/edit.svg"
          alt="Editar"
          href={`/replacements/edit/${id}`}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        />

        <DeleteButton
          icon="/delete.svg"
          alt="Eliminar"
          onClick={deleteReplacement}
          className="bg-red-100 text-red-600 hover:bg-red-200"
        />
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function InfoCard({ label, value, sub }) {
  return (
    <div
      className="
      bg-white/80 backdrop-blur-xl
      rounded-2xl border border-gray-100
      shadow-sm
      p-6
    "
    >
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-lg font-medium text-gray-900">
        {value}
      </p>
      {sub && (
        <p className="text-sm text-gray-500 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}

