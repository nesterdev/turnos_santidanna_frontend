import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";

/* 🔹 helper */
const cleanPayload = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== undefined && v !== "" && !Number.isNaN(v)
    )
  );

export default function AreasEditForm({ id }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("");

  const [complexity_level, setComplexity_level] = useState("");
  const [priority_level, setPriority_level] = useState("");
  const [frequency_type, setFrequency_type] = useState("");
  const [frequency_value, setFrequency_value] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* LOAD */
  useEffect(() => {
    async function loadArea() {
      try {
        const res = await apiFetch(`/areas/${id}`);
        if (res?.success) {
          const a = res.data;
          setName(a.name ?? "");
          setDescription(a.description ?? "");
          setZone(a.zone ?? "");
          setComplexity_level(a.complexity_level ?? "");
          setPriority_level(a.priority_level ?? "");
          setFrequency_type(a.frequency_type ?? "");
          setFrequency_value(a.frequency_value ?? "");
        } else {
          setError(res?.message || "No se pudo cargar el área");
        }
      } catch (err) {
        setError(err?.message || "Error cargando el área");
      } finally {
        setLoading(false);
      }
    }
    loadArea();
  }, [id]);

  /* PAYLOAD */
  const payload = useMemo(() => {
    return cleanPayload({
      name,
      description,
      zone,
      complexity_level:
        complexity_level !== "" ? Number(complexity_level) : undefined,
      priority_level:
        priority_level !== "" ? Number(priority_level) : undefined,
      frequency_type,
      frequency_value:
        frequency_value !== "" ? Number(frequency_value) : undefined,
    });
  }, [
    name,
    description,
    zone,
    complexity_level,
    priority_level,
    frequency_type,
    frequency_value,
  ]);

  /* SAVE */
  const handleSubmit = async () => {
    if (!Object.keys(payload).length) {
      setError("No hay cambios para guardar");
      return;
    }

    try {
      const res = await apiFetch(`/areas/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res?.success) {
        setSuccess("Área actualizada correctamente");
        setTimeout(() => (window.location.href = "/areas"), 900);
      } else {
        setError(res?.message || "Error actualizando el área");
      }
    } catch (err) {
      setError(err?.message || "Error al actualizar");
    }
  };

  if (loading)
    return (
      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl max-w-xl mx-auto">
        Cargando área…
      </p>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowConfirm(true);
      }}
      className="max-w-2xl mx-auto bg-white rounded-2xl px-8 py-7
                 shadow-[0_12px_30px_rgba(0,0,0,0.04)] space-y-8"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Editar área
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza la información del área de trabajo
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          {success}
        </p>
      )}

      {/* INFO BÁSICA */}
      <Section title="Información básica">
        <Input label="Nombre" value={name} onChange={setName} />
        <Textarea
          label="Descripción"
          value={description}
          onChange={setDescription}
        />
        <Input label="Zona" value={zone} onChange={setZone} />
      </Section>

      {/* CONFIGURACIÓN */}
      <Section title="Configuración">
        <Select
          label="Complejidad"
          value={complexity_level}
          onChange={setComplexity_level}
          options={[
            ["", "—"],
            ["2", "Baja"],
            ["4", "Media"],
          ]}
        />
        <Select
          label="Prioridad"
          value={priority_level}
          onChange={setPriority_level}
          options={[
            ["", "—"],
            ["4", "Baja"],
            ["3", "Media"],
            ["2", "Alta"],
            ["1", "Crítica"],
          ]}
        />
      </Section>

      {/* FRECUENCIA */}
      <Section title="Frecuencia">
        <Select
          label="Tipo"
          value={frequency_type}
          onChange={setFrequency_type}
          options={[
            ["", "—"],
            ["daily", "Diaria"],
            ["weekly", "Semanal"],
            ["monthly", "Mensual"],
          ]}
        />
        <Input
          label="Cantidad"
          type="number"
          value={frequency_value}
          onChange={setFrequency_value}
        />
      </Section>

      {/* CONFIRMACIÓN */}
      {showConfirm && (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4 text-sm">
          <p className="font-medium text-gray-800">
            Confirmar cambios
          </p>

          <pre className="bg-white rounded-lg p-3 text-xs text-gray-600 overflow-auto max-h-60">
            {JSON.stringify(payload, null, 2)}
          </pre>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 rounded-lg bg-white border text-gray-600 hover:bg-gray-50"
            >
              Seguir editando
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-[#FF3131] text-white hover:bg-[#e62b2b]"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {!showConfirm && (
        <div className="flex justify-between pt-2">
          <ActionButton
            icon="/left.svg"
            alt="Volver"
            href="/areas"
            className="bg-gray-50 text-gray-600 hover:bg-gray-100"
          />
          <button className="px-5 py-2 rounded-lg bg-[#FF3131] text-white hover:bg-[#e62b2b]">
            Confirmar cambios
          </button>
        </div>
      )}
    </form>
  );
}

/* ---------------- UI helpers ---------------- */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {title}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-[#FF3131]/20"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1 md:col-span-2">
      <label className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-[#FF3131]/20"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
