// src/components/areas/AreasForm.jsx
import { useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alerts";
import { redirect } from "../../lib/utils/navigation";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import TabFilter from "../ui/TabFilter";

const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Diaria" },
  { id: "weekly", label: "Semanal" },
  { id: "monthly", label: "Mensual" },
];

export default function AreasForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("");

  const [complexity_level, setComplexity] = useState(2);
  const [priority_level, setPriority] = useState(2);
  const [frequency_type, setFrequencyType] = useState("daily");
  const [frequency_value, setFrequencyValue] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Completa este campo";
    if (!zone.trim()) errs.zone = "Completa este campo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

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
        showSuccess("Área creada correctamente.", {
          onClose: () => redirect("/areas"),
        });
      } else {
        showError(res?.message || "Error al procesar la solicitud.");
      }
    } catch {
      showError("Error inesperado al crear el área.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-6 flex justify-center">
      <form
        onSubmit={submit}
        noValidate
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 space-y-8 shadow-xl shadow-gray-200/40"
      >
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Crear nueva área
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Configura las características y la frecuencia de limpieza del área.
          </p>
        </div>

        {/* INPUTS PRINCIPALES */}
        <div className="space-y-5">
          <Field label="Nombre del área" error={errors.name}>
            <Input
              value={name}
              onChange={(val) => {
                setName(val);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              hasError={Boolean(errors.name)}
              placeholder="Ej. Salón Principal"
            />
          </Field>

          <Field label="Descripción" hint="Opcional: detalles o notas sobre el área">
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Escribe una pequeña descripción..."
            />
          </Field>

          <Field label="Zona" error={errors.zone}>
            <Input
              value={zone}
              onChange={(val) => {
                setZone(val);
                if (errors.zone) setErrors((prev) => ({ ...prev, zone: null }));
              }}
              hasError={Boolean(errors.zone)}
              placeholder="Ej. Sector Norte"
            />
          </Field>
        </div>

        {/* COMPLEJIDAD */}
        <Section title="COMPLEJIDAD">
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
        <Section title="PRIORIDAD DE ASEO">
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

        {/* FRECUENCIA CON TABFILTER */}
        <Section title="FRECUENCIA">
          <TabFilter
            options={FREQUENCY_OPTIONS}
            value={frequency_type}
            onChange={setFrequencyType}
            fullWidth
            size="md"
            layoutId="frequency-type-tab"
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setFrequencyValue((v) => Math.max(1, v - 1))}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition font-bold active:scale-95 cursor-pointer"
            >
              −
            </button>
            <input
              type="number"
              value={frequency_value}
              className="w-20 text-center py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none"
              onChange={(e) => setFrequencyValue(Number(e.target.value))}
            />
            <button
              type="button"
              onClick={() => setFrequencyValue((v) => v + 1)}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition font-bold active:scale-95 cursor-pointer"
            >
              +
            </button>
          </div>
        </Section>

        {/* ACCIONES */}
        <div className="flex justify-end items-center gap-3 border-t border-gray-100 pt-6">
          <a
            href="/areas"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
          >
            Cancelar
          </a>
          <button
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 active:scale-95 text-white font-semibold text-xs transition shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Guardando…" : "Crear área"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CardRadio({ title, subtitle, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
        active
          ? "border-red-500/40 bg-white ring-2 ring-red-500/10 shadow-xs"
          : "border-gray-200/80 bg-white hover:border-gray-300"
      }`}
    >
      <div>
        <p className="font-semibold text-sm text-gray-800">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          active ? "border-red-500" : "border-gray-300"
        }`}
      >
        {active && <div className="w-2.5 h-2.5 rounded-full bg-[#FF3131]" />}
      </div>
    </div>
  );
}