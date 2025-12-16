// src/components/shifts/ShiftsForm.jsx
import { useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function ShiftsForm() {
  const [name, setName] = useState("");
  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");
  const [is_night, setIs_night] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch("/shifts", {
        method: "POST",
        body: JSON.stringify({
          name,
          start_time,
          end_time,
          is_night,
        }),
      });

      if (res?.success) {
        setSuccess("Turno creado correctamente.");
        setTimeout(() => (window.location.href = "/shifts"), 800);
      } else {
        setError(res?.message || "Error al crear el turno.");
      }
    } catch (err) {
      setError(err?.message || "Error al crear el turno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-2xl mx-auto
        bg-white/70 backdrop-blur-xl
        rounded-2xl
        border border-gray-100
        shadow-[0_8px_30px_rgb(0,0,0,0.03)]
        p-8 space-y-7
      "
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          Crear nuevo turno
        </h2>
        <p className="text-sm text-gray-500">
          Define horarios claros para asignación de empleados.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50/70 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50/70 border border-green-100 rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Nombre del turno
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Turno Mañana"
            className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2.5 text-sm
              placeholder:text-gray-400
              focus:outline-none
              focus:border-gray-300
              focus:ring-2 focus:ring-black/5
            "
          />
        </div>

        {/* Hora inicio */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Hora de ingreso
          </label>
          <input
            type="time"
            value={start_time}
            onChange={(e) => setStart_time(e.target.value)}
            required
            className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2.5 text-sm
              focus:outline-none
              focus:border-gray-300
              focus:ring-2 focus:ring-black/5
            "
          />
        </div>

        {/* Hora salida */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Hora de salida
          </label>
          <input
            type="time"
            value={end_time}
            onChange={(e) => setEnd_time(e.target.value)}
            required
            className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2.5 text-sm
              focus:outline-none
              focus:border-gray-300
              focus:ring-2 focus:ring-black/5
            "
          />
        </div>
      </div>

      {/* Night shift */}
      <div className="
        flex items-center justify-between
        rounded-xl
        border border-gray-200
        bg-gray-50/50
        px-4 py-3
      ">
        <div>
          <p className="text-sm font-medium text-gray-800">
            Turno nocturno
          </p>
          <p className="text-xs text-gray-500">
            Marca si este turno corresponde a horario nocturno
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIs_night(!is_night)}
          className={`
            relative inline-flex h-6 w-11 items-center
            rounded-full transition
            ${is_night ? "bg-black" : "bg-gray-300"}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4
              transform rounded-full bg-white
              transition
              ${is_night ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <a
          href="/shifts"
          className="
            px-5 py-2.5 text-sm
            rounded-xl
            border border-gray-200
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          Cancelar
        </a>

        <button
          type="submit"
          disabled={loading}
          className="
            px-5 py-2.5 text-sm
            rounded-xl
            bg-black text-white
            shadow-sm
            hover:bg-gray-900 hover:shadow-md
            transition-all
            disabled:opacity-50
          "
        >
          {loading ? "Guardando..." : "Crear turno"}
        </button>
      </div>
    </form>
  );
}
