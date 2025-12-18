import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";

export default function AreasView() {
  const [area, setArea] = useState(null);
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


  const deleteArea = async () => {
    const confirmed = await openConfirmModal({
      title: "Eliminar área",
      message: "Esta acción es permanente y no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/areas/${id}`, { method: "DELETE" });
      window.location.href = "/areas";
    } catch {
      alert("Error eliminando el área");
    }
  };

  useEffect(() => {
    if (!id) return;
    if (id) loadArea(id);
  }, [id]);

  async function loadArea(areaId) {
    try {
      const res = await apiFetch(`/areas/${areaId}`);
      if (res?.success) setArea(res.data);
      else setError(res?.message || "No se pudo cargar el área");
    } catch (err) {
      setError(err?.message || "No se pudo cargar el área");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl max-w-xl mx-auto">
        Cargando información del área…
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl max-w-xl mx-auto">
        {error}
      </p>
    );

  if (!area) return null;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl px-7 py-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {area.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Detalles del área de trabajo
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Info */}
      <div className="space-y-5 text-sm">
        <InfoItem label="ID del área" value={area.id} />
        <InfoItem
          label="Descripción"
          value={area.description || "—"}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/areas"
          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
        />

        <div className="flex gap-3">
          <ActionButton
            icon="/edit.svg"
            alt="Editar"
            href={`/areas/edit?id=${area.id}`}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
          />

          <DeleteButton
            icon="/delete.svg"
            alt="Eliminar"
            onClick={deleteArea}
            className="bg-red-50 text-red-600 hover:bg-red-100"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Subcomponente elegante para info
--------------------------------------------- */
function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
