import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alert";
import { redirect } from "../../lib/utils/navigation";

export default function ReplacementsEditForm() {
  // Estados para los campos editables del reemplazo
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [notes, setNotes] = useState("");

  // Estados informativos (para mostrar quién es quién gracias a las relaciones)
  const [employeeName, setEmployeeName] = useState("");
  const [replacerName, setReplacerName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [id, setId] = useState(null);

  // 1. Efecto para leer el ID de la URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    if (!empId) {
      setError("ID de reemplazo inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);

  // 2. Efecto para cargar los datos del reemplazo usando el objeto que llega de la API
  useEffect(() => {
    if (!id) return;

    async function loadReplacement() {
      try {
        const res = await apiFetch(`/replacements/${id}`);

        if (res?.success) {
          const data = res.data;
          
          // Mapeamos los campos editables
          setDate(data.date || "");
          setStatus(data.status || "pendiente");
          setNotes(data.notes || "");

          // Mapeamos los nombres informativos de las relaciones
          setEmployeeName(data.ReplacementEmployee?.name || "—");
          setReplacerName(data.ReplacementReplacer?.name || "—");
        } else {
          setError(res?.message || "No se pudo cargar el reemplazo");
        }
      } catch (err) {
        setError(err?.message || "Error cargando el reemplazo");
      } finally {
        setLoading(false);
      }
    }

    loadReplacement();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch(`/replacements/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          date,
          status,
          notes,
        }),
      });

      if (res?.success) {
        showSuccess("Reemplazo actualizado correctamente", {
          onClose: () => redirect("/replacements"),
        });
      } else {
        showError(res?.message || "Error actualizando el reemplazo");
      }
    } catch (err) {
      showError(err?.message || "Error al actualizar el reemplazo");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white/75 border border-gray-100 shadow-sm text-gray-500 animate-pulse">
        Cargando reemplazo…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-2xl mx-auto
        bg-white/90 backdrop-blur-xl
        rounded-2xl border border-gray-100
        shadow-sm
        p-8 space-y-6
      "
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Editar reemplazo</h2>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza los detalles y el estado de esta sustitución de turno
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      {/* Info informativa de las relaciones (No editable directamente aquí) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/70 rounded-xl border border-gray-100 text-xs">
        <div>
          <span className="text-gray-400 block mb-0.5 font-medium">Empleado titular:</span>
          <span className="font-semibold text-gray-800 text-sm">{employeeName}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5 font-medium">Reemplazado por:</span>
          <span className="font-semibold text-gray-800 text-sm">{replacerName}</span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha del reemplazo
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="
              w-full rounded-xl border border-gray-200
              px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              w-full rounded-xl border border-gray-200
              px-4 py-2.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        {/* Notas */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas u observaciones
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Escribe alguna observación opcional..."
            className="
              w-full rounded-xl border border-gray-200
              px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <a
          href="/replacements"
          className="
            px-5 py-2.5 text-sm rounded-xl
            border border-gray-200
            text-gray-700
            hover:bg-gray-50 transition
          "
        >
          Cancelar
        </a>

        <button
          type="submit"
          className="
            px-5 py-2.5 text-sm rounded-xl
            bg-black text-white
            hover:bg-gray-900 transition
            shadow-sm
          "
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}