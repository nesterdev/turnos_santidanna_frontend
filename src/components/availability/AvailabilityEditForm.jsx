// src/components/availability/AvailabilityEditForm.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alerts";
import { redirect } from "../../lib/utils/navigation";
import Loading from "../ui/Loading";
import EmployeeSelector from "../ui/EmployeeSelector";

const DAYS_OPTIONS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export default function AvailabilityEditForm() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [available, setAvailable] = useState(true);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState(null);

  // Carga de parámetro ID de la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const availId = params.get("id");

    if (!availId) {
      showError("ID de disponibilidad inválido");
      setLoading(false);
      return;
    }

    setId(availId);
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const [empRes, availRes] = await Promise.all([
          apiFetch("/employees"),
          apiFetch(`/availability/${id}`),
        ]);

        const empList = Array.isArray(empRes?.data)
          ? empRes.data
          : Array.isArray(empRes)
          ? empRes
          : [];

        setEmployees(empList);

        if (availRes?.success) {
          const a = availRes.data;
          setEmployeeId(a.employee_id);
          setDayOfWeek(a.day_of_week);
          setAvailable(Boolean(a.available));
          setNotes(a.notes || "");
        } else {
          showError("No se pudo cargar la información de disponibilidad");
        }
      } catch (err) {
        showError(err?.message || "Error cargando la información");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (employeeId === null || dayOfWeek === null) {
      showError("Debes seleccionar un empleado y un día de la semana.");
      return;
    }

    setSaving(true);

    try {
      const res = await apiFetch(`/availability/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          employee_id: employeeId,
          day_of_week: dayOfWeek,
          available,
          notes: notes || null,
        }),
      });

      if (res?.success || res) {
        showSuccess("Disponibilidad actualizada correctamente", {
          onClose: () => redirect("/availability"),
        });
      } else {
        showError(res?.message || "Error actualizando la disponibilidad");
      }
    } catch (err) {
      showError(err?.message || "Error guardando los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullscreen={false} text="Cargando disponibilidad..." />;
  }

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
            Editar disponibilidad
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Ajusta la configuración de disponibilidad del empleado seleccionado.
          </p>
        </div>

        {/* SELECTOR DE EMPLEADO */}
        <EmployeeSelector
          label="EMPLEADO"
          employees={employees}
          selectedIds={employeeId ? [employeeId] : []}
          onSelect={(selectedId) => setEmployeeId(selectedId)}
          multiple={false}
        />

        {/* DÍA DE LA SEMANA */}
        <Section title="DÍA DE LA SEMANA">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {DAYS_OPTIONS.map((d) => (
              <CardRadio
                key={d.value}
                title={d.label}
                active={dayOfWeek === d.value}
                onClick={() => setDayOfWeek(d.value)}
              />
            ))}
          </div>
        </Section>

        {/* DISPONIBILIDAD */}
        <Section title="¿ESTÁ DISPONIBLE?">
          <div className="grid sm:grid-cols-2 gap-3">
            <CardRadio
              title="Sí (Disponible)"
              subtitle="El trabajador podrá ser asignado a turnos este día"
              active={available === true}
              onClick={() => setAvailable(true)}
            />
            <CardRadio
              title="No (Descanso / No disponible)"
              subtitle="Marca este día como no disponible para la semana"
              active={available === false}
              onClick={() => setAvailable(false)}
            />
          </div>
        </Section>

        {/* NOTAS */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
            Notas / Observación
          </h3>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Solicitud médica, descanso acordado por administración..."
            className="w-full text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 transition resize-none"
          />
        </div>

        {/* ACCIONES */}
        <div className="flex justify-end items-center gap-3 border-t border-gray-100 pt-6">
          <a
            href="/availability"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
          >
            Cancelar
          </a>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 active:scale-95 text-white font-semibold text-xs transition shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {saving ? "Guardando…" : "Guardar Cambios"}
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
      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between select-none ${
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