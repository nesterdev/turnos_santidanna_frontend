// src/components/areas/AreasEditForm.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alerts";
import { redirect } from "../../lib/utils/navigation";
import Loading from "../ui/Loading";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import TabFilter from "../ui/TabFilter";

const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Diaria" },
  { id: "weekly", label: "Semanal" },
  { id: "monthly", label: "Mensual" },
];

export default function AreasEditForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("");

  const [complexity_level, setComplexity] = useState(2);
  const [priority_level, setPriority] = useState(2);
  const [frequency_type, setFrequencyType] = useState("daily");
  const [frequency_value, setFrequencyValue] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [id, setId] = useState(null);

  // Carga de parámetro ID de la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const areaId = params.get("id");

    if (!areaId) {
      showError("ID de área inválido");
      setLoading(false);
      return;
    }

    setId(areaId);
  }, []);

  // Carga inicial del área
  useEffect(() => {
    if (!id) return;
    async function loadArea() {
      try {
        const res = await apiFetch(`/areas/${id}`);
        if (res?.success) {
          const a = res.data;
          setName(a.name ?? "");
          setDescription(a.description ?? "");
          setZone(a.zone ?? "");
          setComplexity(Number(a.complexity_level) || 2);
          setPriority(Number(a.priority_level) || 2);
          setFrequencyType(a.frequency_type || "daily");
          setFrequencyValue(Number(a.frequency_value) || 1);
        } else {
          showError(res?.message || "No se pudo cargar el área");
        }
      } catch (err) {
        showError(err?.message || "Error cargando el área");
      } finally {
        setLoading(false);
      }
    }
    loadArea();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Completa este campo";
    if (!zone.trim()) errs.zone = "Completa este campo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await apiFetch(`/areas/${id}`, {
        method: "PUT",
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
        showSuccess("Área actualizada correctamente", {
          onClose: () => redirect("/areas"),
        });
      } else {
        showError(res?.message || "Error actualizando el área");
      }
    } catch (err) {
      showError(err?.message || "Error al actualizar");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullscreen={false} text="Cargando información del área..." />;

  return (
    <div className="w-full py-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 space-y-8 shadow-xl shadow-gray-200/40"
      >
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Editar área
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Actualiza la información y configuración operativa del área.
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
            layoutId="frequency-type-edit-tab"
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
              onChange={(e) => setFrequencyValue(Number(e.target.value))}
              className="w-20 text-center py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none"
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
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 active:scale-95 text-white font-semibold text-xs transition shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? "Guardando…" : "Guardar Cambios"}
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