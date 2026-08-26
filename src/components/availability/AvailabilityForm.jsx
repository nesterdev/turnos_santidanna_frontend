import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alert";
import { redirect } from "../../lib/utils/navigation";

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

  // Nueva selección de Semana (0 = Semana Actual, 1 = Próxima Semana)
  const [weekTarget, setWeekTarget] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/employees")
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
          ? res.data
          : [];
        setEmployees(list);
      })
      .catch(() => setError("No se pudo cargar la lista de empleados."));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!employee_id) return setError("Debes seleccionar un empleado.");
    if (day_of_week === null) return setError("Debes seleccionar un día de la semana.");

    setError("");
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
    <form
      onSubmit={submit}
      className="max-w-3xl bg-white rounded-2xl p-8 sm:p-10 space-y-8 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Gestión de Disponibilidad</h2>
        <p className="text-sm text-gray-500 mt-1">
          Asigna o restringe la disponibilidad diaria para un empleado específico.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* SELECCIÓN DE SEMANA */}
      {!availability && (
        <Section title="Semana de Aplicación">
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

      {/* EMPLEADO */}
      <Section title="Empleado">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {employees.map((e) => (
            <CardRadio
              key={e.id}
              title={e.name}
              active={employee_id === e.id}
              onClick={() => setEmployee(e.id)}
            />
          ))}
        </div>
      </Section>

      {/* DÍA */}
      <Section title="Día de la semana">
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
      <Section title="¿Está disponible?">
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
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
          Notas / Observación
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Solicitud médica, descanso acordado por administración..."
          className="w-full text-sm p-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-6">
        <a
          href="/availability"
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition shadow-sm disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Disponibilidad"}
        </button>
      </div>
    </form>
  );
}

/* ================= COMPONENTES UI ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function CardRadio({ title, subtitle, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
        active
          ? "border-red-500 bg-red-50/30 ring-1 ring-red-500"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <input
        type="radio"
        checked={active}
        onChange={() => {}}
        className="mt-0.5 text-red-500 focus:ring-red-400"
      />
      <div>
        <p className="font-semibold text-sm text-gray-900 leading-tight">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}