import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import DeleteButton from "../ui/deleteButtom";
import ActionButton from "../ui/ActionButtom";
import Loading from "../ui/Loading";

export default function ShiftView() {
  const [turno, setTurno] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shiftId = params.get("id");

    if (!shiftId) {
      setError("ID de turno inválido");
      setLoading(false);
      return;
    }

    setId(shiftId);
  }, []);

  const deleteShift = async (idToDelete) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar turno",
      message: "¿Deseas eliminar este turno? Esta acción es permanente.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/shifts/${idToDelete}`, { method: "DELETE" });
      window.location.href = "/shifts";
    } catch {
      alert("Error eliminando el turno");
    }
  };

  useEffect(() => {
    if (!id) return;
    async function loadTurno() {
      try {
        const res = await apiFetch(`/shifts/${id}`);
        if (res?.success) {
          setTurno(res.data);
        } else {
          setError(res?.message || "No se pudo cargar el turno");
        }
      } catch (err) {
        setError(err?.message || "No se pudo cargar el turno");
      } finally {
        setLoading(false);
      }
    }

    loadTurno();
  }, [id]);

  if (loading) return <Loading fullscreen={false} text="Cargando información..." />;

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
        {error}
      </div>
    );

  if (!turno) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-8 py-7 space-y-8 border border-gray-100/80">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {turno.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Detalle e información del turno
          </p>
        </div>

        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700">
          Turno #{turno.id}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-sm">
        <InfoItem label="Hora de Ingreso" value={turno.start_time} fontMono />
        <InfoItem label="Hora de Salida" value={turno.end_time} fontMono />
        
        <InfoItem 
          label="Tiempo de Descanso" 
          value={turno.break_time ? `${turno.break_time} min` : "0 min"} 
          fontMono 
        />
        
        <InfoItem 
          label="Jornada" 
          value={turno.is_night ? "Nocturna 🌙" : "Diurna ☀️"} 
        />

        <InfoItem label="Notas" value={turno.notes} />
        
        <InfoItem
          label="Creado el"
          value={
            turno.created_at
              ? new Date(turno.created_at).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"
          }
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/shifts"
          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
        />

        <div className="flex gap-3">
          <ActionButton
            icon="/edit.svg"
            alt="Editar"
            href={`/shifts/edit?id=${id}`}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
          />

          <DeleteButton
            icon="/delete.svg"
            alt="Eliminar"
            onClick={() => deleteShift(id)}
            className="bg-red-50 text-red-600 hover:bg-red-100"
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, fontMono }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
        {label}
      </p>
      <p className={`text-gray-900 font-medium ${fontMono ? "font-mono font-semibold text-base" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}