import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";

const daysMap = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export default function AvailabilityView() {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const [id, setId] = useState(null);
  // 👇 LEER QUERY PARAM EN CLIENTE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    console.log("id leída desde URL:", empId);

    if (!empId) {
      setError("ID de empleado inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);


  useEffect(() => {
    if (!id) return;
    if (id) loadAvailability(id);
  }, [id]);

  async function loadAvailability(availabilityId) {
    try {
      const res = await apiFetch(`/availability/${availabilityId}`);
      console.log("availability", res);
      if (res?.success) setAvailability(res.data);
      else setError(res?.message || "No se pudo cargar la disponibilidad");
    } catch (err) {
      setError(err?.message || "No se pudo cargar la disponibilidad");
    } finally {
      setLoading(false);
    }
  }

  const deleteAvailability = async () => {
    const confirmed = await openConfirmModal({
      title: "Eliminar disponibilidad",
      message: "Esta acción es permanente y no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/availability/${id}`, { method: "DELETE" });
      window.location.href = "/availability";
    } catch {
      alert("Error eliminando la disponibilidad");
    }
  };

  if (loading)
    return (
      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl max-w-xl mx-auto">
        Cargando disponibilidad…
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl max-w-xl mx-auto">
        {error}
      </p>
    );

  if (!availability) return null;

  const employee = availability.AvailabilityEmployee;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl px-8 py-7
                    shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-7">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Disponibilidad
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Información detallada del día asignado
        </p>
      </div>

      <Divider />

      {/* INFO */}
      <div className="space-y-5 text-sm">
        <InfoItem
          label="Empleado"
          value={employee?.name || "—"}
        />

        <InfoItem
          label="Rol"
          value={employee?.role || "—"}
        />

        <InfoItem
          label="Día de la semana"
          value={daysMap[availability.day_of_week]}
        />

        <InfoItem
          label="Disponible"
          value={
            availability.available ? (
              <StatusBadge type="success" text="Sí" />
            ) : (
              <StatusBadge type="danger" text="No" />
            )
          }
        />

        <InfoItem
          label="Notas"
          value={availability.notes || "—"}
        />

        <InfoItem
          label="Creado"
          value={new Date(
            availability.created_at
          ).toLocaleDateString()}
        />
      </div>

      <Divider />

      {/* ACTIONS */}
      <div className="flex items-center justify-between">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/availability"
          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
        />

        <div className="flex gap-3">
          <ActionButton
            icon="/edit.svg"
            alt="Editar"
            href={`/availability/edit?id=${availability.id}`}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
          />

          <DeleteButton
            icon="/delete.svg"
            alt="Eliminar"
            onClick={deleteAvailability}
            className="bg-red-50 text-red-600 hover:bg-red-100"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Divider() {
  return <div className="h-px bg-gray-100" />;
}

function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}

function StatusBadge({ type, text }) {
  const styles = {
    success: "bg-green-50 text-green-700 border-green-200",
    danger: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full
                  text-xs font-medium border ${styles[type]}`}
    >
      {text}
    </span>
  );
}
