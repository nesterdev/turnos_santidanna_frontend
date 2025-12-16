import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function AvailabilityForm({ availability = null }) {
  const [employees, setEmployees] = useState([]);
  const [employee_id, setEmployee] = useState(
    availability?.employee_id || null
  );
  const [day_of_week, setDay] = useState(availability?.day_of_week ?? null);
  const [available, setAvailable] = useState(availability?.available ?? true);
  const [notes, setNotes] = useState(availability?.notes || "");

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
    setError("");
    setLoading(true);

    try {
      const payload = {
        employee_id,
        day_of_week,
        available,
        notes: notes || null,
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

      window.location.href = "/availability";
    } catch (err) {
      setError(err.message || "Error guardando disponibilidad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl bg-white rounded-2xl p-10 space-y-10
                 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Disponibilidad</h2>
        <p className="text-sm text-gray-500">
          Define el día y disponibilidad del empleado.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* EMPLEADO */}
      <Section title="Empleado">
        <div className="grid sm:grid-cols-2 gap-3">
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
        <div className="grid sm:grid-cols-3 gap-3">
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
            title="Sí"
            subtitle="Puede trabajar este día"
            active={available === true}
            onClick={() => setAvailable(true)}
          />
          <CardRadio
            title="No"
            subtitle="No está disponible"
            active={available === false}
            onClick={() => setAvailable(false)}
          />
        </div>
      </Section>

      {/* NOTAS */}
      <Textarea label="Notas" value={notes} onChange={setNotes} />

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-6">
        <a href="/availability" className="px-4 py-2 rounded-xl border">
          Cancelar
        </a>
        <button
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-red-500 text-white
                     font-medium hover:bg-red-600 transition"
        >
          {loading ? "Guardando…" : "Guardar"}
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
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
