// src/components/availability/AvailabilityForm.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alerts";
import { redirect } from "../../lib/utils/navigation";
import EmployeeSelector from "../ui/EmployeeSelector";

// Utility para calcular el Lunes de la semana en formato YYYY-MM-DD
function getMondayOfWeek(offsetWeeks = 0) {
  const d = new Date();
  const day = d.getDay(); // 0 = Dom, 1 = Lun...
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1) + offsetWeeks * 7;
  const monday = new Date(d.setDate(diffToMonday));
  return monday.toISOString().split("T")[0];
}

export default function AvailabilityForm({ availability = null }) {
  const [employees, setEmployees] = useState([]);
  const [employee_id, setEmployee] = useState(availability?.employee_id || null);
  const [day_of_week, setDay] = useState(availability?.day_of_week ?? null);
  const [available, setAvailable] = useState(availability?.available ?? false);
  const [notes, setNotes] = useState(availability?.notes || "");

  // Selección de Semana (0 = Semana Actual, 1 = Próxima Semana)
  const [weekTarget, setWeekTarget] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/employees")
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setEmployees(list);
      })
      .catch(() => showError("No se pudo cargar la lista de empleados."));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!employee_id) return showError("Debes seleccionar un empleado.");
    if (day_of_week === null) return showError("Debes seleccionar un día de la semana.");

    setLoading(true);

    try {
      const selectedWeekStart = getMondayOfWeek(weekTarget);

      const payload = {
        employee_id,
        day_of_week,
        available,
        notes: notes || null,
        week_start: availability?.week_start || selectedWeekStart,
      };

      if (availability) {
        await apiFetch(`/availability/${availability.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/availability", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      showSuccess("Disponibilidad guardada correctamente", {
        onClose: () => redirect("/availability"),
      });
    } catch (err) {
      showError(err.message || "Error guardando disponibilidad.");
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
            Gestión de Disponibilidad
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Asigna o restringe la disponibilidad diaria para un empleado específico.
          </p>
        </div>

        {/* SELECCIÓN DE SEMANA */}
        {!availability && (
          <Section title="SEMANA DE APLICACIÓN">
            <div className="grid sm:grid-cols-2 gap-3">
              <CardRadio
                title="Semana Actual"
                subtitle={`Inicia el lunes ${getMondayOfWeek(0)}`}
                active={weekTarget === 0}
                onClick={() => setWeekTarget(0)}
              />
              <CardRadio
                title="Próxima Semana"
                subtitle={`Inicia el lunes ${getMondayOfWeek(1)}`}
                active={weekTarget === 1}
                onClick={() => setWeekTarget(1)}
              />
            </div>
          </Section>
        )}

        {/* COMPONENTE SELECCIÓN DE EMPLEADO */}
        <EmployeeSelector
          label="EMPLEADO"
          employees={employees}
          selectedIds={employee_id ? [employee_id] : []}
          onSelect={(id) => setEmployee(id)}
          multiple={false}
        />

        {/* DÍA DE LA SEMANA */}
        <Section title="DÍA DE LA SEMANA">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { v: 1, l: "Lunes" },
              { v: 2, l: "Martes" },
              { v: 3, l: "Miércoles" },
              { v: 4, l: "Jueves" },
              { v: 5, l: "Viernes" },
              { v: 6, l: "Sábado" },
              { v: 0, l: "Domingo" },
            ].map((d) => (
              <CardRadio
                key={d.v}
                title={d.l}
                active={day_of_week === d.v}
                onClick={() => setDay(d.v)}
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
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 active:scale-95 text-white font-semibold text-xs transition shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Guardando…" : "Guardar Disponibilidad"}
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