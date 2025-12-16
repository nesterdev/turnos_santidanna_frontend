import { useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function AreasForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("");

  const [complexity_level, setComplexity] = useState(2);
  const [priority_level, setPriority] = useState(2);
  const [frequency_type, setFrequencyType] = useState("daily");
  const [frequency_value, setFrequencyValue] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/areas", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          zone,
          complexity_level,
          priority_level,
          frequency_type,
          frequency_value,
        }),
      });

      if (res?.success) {
        setSuccess("Área creada correctamente.");
        setTimeout(() => (window.location.href = "/areas"), 1000);
      } else {
        setError(res?.message);
      }
    } catch {
      setError("Error creando el área.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl bg-white rounded-2xl border p-10 space-y-10 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Crear nueva área
        </h2>
        <p className="text-sm text-gray-500">
          Define características y frecuencia de limpieza.
        </p>
      </div>

      {/* FEEDBACK */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* INFO */}
      <div className="space-y-4">
        <Input label="Nombre del área" value={name} onChange={setName} required />
        <Textarea
          label="Descripción"
          value={description}
          onChange={setDescription}
        />
        <Input label="Zona" value={zone} onChange={setZone} required />
      </div>

      {/* COMPLEJIDAD */}
      <Section title="Complejidad">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { value: 2, label: "Baja", desc: "Liviana, rápida" },
            { value: 4, label: "Media", desc: "Más esfuerzo" },
          ].map((o) => (
            <CardRadio
              key={o.value}
              active={complexity_level === o.value}
              onClick={() => setComplexity(o.value)}
              title={o.label}
              subtitle={o.desc}
            />
          ))}
        </div>
      </Section>

      {/* PRIORIDAD */}
      <Section title="Prioridad de aseo">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { value: 1, label: "Crítica" },
            { value: 2, label: "Alta" },
            { value: 3, label: "Media" },
            { value: 4, label: "Baja" },
          ].map((o) => (
            <CardRadio
              key={o.value}
              active={priority_level === o.value}
              onClick={() => setPriority(o.value)}
              title={o.label}
            />
          ))}
        </div>
      </Section>

      {/* FRECUENCIA */}
      <Section title="Frecuencia">
        <div className="flex gap-2">
          {[
            { v: "daily", l: "Diaria" },
            { v: "weekly", l: "Semanal" },
            { v: "monthly", l: "Mensual" },
          ].map((f) => (
            <button
              key={f.v}
              type="button"
              onClick={() => setFrequencyType(f.v)}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                frequency_type === f.v
                  ? "bg-red-50 border-red-500 text-red-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>

        {/* NUMBER */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() =>
              setFrequencyValue((v) => Math.max(1, v - 1))
            }
            className="px-3 py-2 rounded-xl border"
          >
            −
          </button>
          <input
            type="number"
            value={frequency_value}
            className="input w-24 text-center"
            onChange={(e) => setFrequencyValue(Number(e.target.value))}
          />
          <button
            type="button"
            onClick={() => setFrequencyValue((v) => v + 1)}
            className="px-3 py-2 rounded-xl border"
          >
            +
          </button>
        </div>
      </Section>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-6">
        <a href="/areas" className="px-4 py-2 rounded-xl border">
          Cancelar
        </a>
        <button
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
        >
          {loading ? "Guardando…" : "Crear área"}
        </button>
      </div>
    </form>
  );
}

/* ================= UI ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input resize-none"
      />
    </div>
  );
}

function CardRadio({ title, subtitle, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card-option ${active ? "card-option-active" : ""}`}
    >
      <input type="radio" checked={active} readOnly className="radio" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
