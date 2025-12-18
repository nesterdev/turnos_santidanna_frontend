import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";

const days = [
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
  const [error, setError] = useState("");
  const [id, setId] = useState(null);
  // 👇 LEER QUERY PARAM EN CLIENTE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    console.log("id leída desde URL:", empId);

    if (!empId) {
      setError("ID de empleado inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);


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
          setAvailable(a.available);
          setNotes(a.notes || "");
        } else {
          setError("No se pudo cargar la disponibilidad");
        }
      } catch {
        setError("Error cargando la información");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (employeeId === null || dayOfWeek === null) {
      setError("Selecciona un empleado y un día");
      return;
    }

    setSaving(true);

    try {
      await apiFetch(`/availability/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          employee_id: employeeId,
          day_of_week: dayOfWeek,
          available,
          notes: notes || null,
        }),
      });

      window.location.href = "/availability";
    } catch (err) {
      setError(err?.message || "Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white/70 border animate-pulse">
        Cargando disponibilidad…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white/80 backdrop-blur-xl
                 rounded-2xl shadow-sm p-8 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Editar disponibilidad
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ajusta la disponibilidad del empleado
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* EMPLEADO */}
      <Field label="Empleado">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {employees.map((emp) => (
            <SelectCard
              key={emp.id}
              title={emp.name}
              description={emp.role}
              active={employeeId === emp.id}
              onClick={() => setEmployeeId(emp.id)}
            />
          ))}
        </div>
      </Field>

      {/* DÍA */}
      <Field label="Día de la semana">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {days.map((d) => (
            <SelectCard
              key={d.value}
              title={d.label}
              active={dayOfWeek === d.value}
              onClick={() => setDayOfWeek(d.value)}
            />
          ))}
        </div>
      </Field>

      {/* DISPONIBLE */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-800">
            Disponible este día
          </p>
          <p className="text-xs text-gray-500">Permite asignarle turnos</p>
        </div>

        <button
          type="button"
          onClick={() => setAvailable((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            available ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 bg-white rounded-full transform transition-transform duration-200 ease-out ${
              available ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* NOTAS */}
      <Field label="Notas">
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Opcional"
          className="w-full rounded-xl border px-4 py-2.5 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </Field>

      {/* ACTIONS */}
      <div className="flex justify-between pt-4 border-t">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/availability"
          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
        />

        <button
          disabled={saving}
          className="px-5 py-2.5 text-sm rounded-xl bg-black text-white
                     hover:bg-gray-900 transition shadow-sm"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

/* ===== UI ===== */

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function SelectCard({ title, description, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-4 transition
        ${
          active
            ? "border-black bg-black/5"
            : "border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div className="flex gap-3 items-start">
        <input
          type="radio"
          checked={active}
          readOnly
          className="mt-1 h-4 w-4"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
