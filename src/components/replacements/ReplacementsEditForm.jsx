import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function ReplacementsEditForm({ id }) {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadShift() {
      try {
        const res = await apiFetch(`/replacements/${id}`);

        if (res?.success) {
            console.log("respuesta de replacements",res)
          const data = res.data;
          setName(data.name || "");
          setStartTime(data.start_time || "");
          setEndTime(data.end_time || "");
        } else {
          setError(res?.message || "No se pudo cargar el turno");
        }
      } catch (err) {
        setError(err?.message || "Error cargando el turno");
      } finally {
        setLoading(false);
      }
    }

    loadShift();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch(`/replacements/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      if (res?.success) {
        setSuccess("Remplazo actualizado correctamente");
        setTimeout(() => {
          window.location.href = "/replacements";
        }, 700);
      } else {
        setError(res?.message || "Error actualizando el turno");
      }
    } catch (err) {
      setError(err?.message || "Error al actualizar el turno");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white/70 border border-gray-100 shadow-sm text-gray-500 animate-pulse">
        Cargando turno…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-2xl mx-auto
        bg-white/80 backdrop-blur-xl
        rounded-2xl border border-gray-100
        shadow-sm
        p-8 space-y-6
      "
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Editar turno
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza la información del horario seleccionado
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

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del turno
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="
              w-full rounded-xl border border-gray-200
              px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          />
        </div>

        {/* Hora inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de ingreso
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="
              w-full rounded-xl border border-gray-200
              px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          />
        </div>

        {/* Hora salida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de salida
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
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
          href="/shifts"
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
