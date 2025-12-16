import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function ScheduleEditForm({ id }) {
  const [date, setDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [isReplacement, setIsReplacement] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [scheduleRes, employeesRes, shiftsRes] = await Promise.all([
          apiFetch(`/schedules/${id}`),
          apiFetch("/employees"),
          apiFetch("/shifts"),
        ]);

        if (!scheduleRes?.success)
          throw new Error("No se pudo cargar el turno");

        const s = scheduleRes.data;

        setDate(s.date);
        setEmployeeId(s.ScheduleEmployee?.id || "");
        setShiftId(s.ScheduleShift?.id || "");
        setIsReplacement(Boolean(s.is_replacement));

        setEmployees(employeesRes?.data || []);
        setShifts(shiftsRes?.data || []);
      } catch (err) {
        setError(err.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        date,
        employee_id: employeeId,
        shift_id: shiftId,
        is_replacement: isReplacement,
      };

      const res = await apiFetch(`/schedules/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res?.success) {
        setSuccess("Schedule actualizado correctamente");
        setTimeout(() => {
          window.location.href = `/schedules/${id}`;
        }, 900);
      } else {
        setError(res?.message || "Error actualizando el turno");
      }
    } catch (err) {
      setError(err?.message || "Error al actualizar");
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-32 bg-gray-100/60 rounded-3xl animate-pulse" />
        <div className="h-64 bg-gray-100/60 rounded-3xl animate-pulse" />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur rounded-3xl px-8 py-6 ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Editar schedule</p>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Programación de turno
            </h1>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50/60 text-red-600 px-4 py-3 rounded-xl ring-1 ring-red-500/10">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-emerald-50/60 text-emerald-700 px-4 py-3 rounded-xl ring-1 ring-emerald-500/10">
            {success}
          </div>
        )}
      </header>

      {/* FORM */}
      <section className="bg-white/80 backdrop-blur rounded-3xl p-8 ring-1 ring-black/5 space-y-6">

        {/* FECHA */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF3131]/40"
          />
        </div>

        {/* EMPLEADO */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Empleado
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF3131]/40"
          >
            <option value="">Selecciona un empleado</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} {e.active === false && "(Inactivo)"}
              </option>
            ))}
          </select>
        </div>

        {/* TURNO */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Turno
          </label>
          <select
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF3131]/40"
          >
            <option value="">Selecciona un turno</option>
            {shifts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.start_time} – {s.end_time})
              </option>
            ))}
          </select>
        </div>

        {/* REEMPLAZO */}
        <div className="flex items-center justify-between rounded-2xl px-4 py-3 bg-gray-50/60 ring-1 ring-black/5">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Turno de reemplazo
            </p>
            <p className="text-xs text-gray-400">
              Marca esto solo si reemplaza a otro empleado
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isReplacement}
              onChange={(e) => setIsReplacement(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition ${
                isReplacement
                  ? "bg-[#FF3131]"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
                  isReplacement
                    ? "translate-x-5"
                    : "translate-x-1"
                }`}
              />
            </div>
          </label>
        </div>
      </section>

      {/* ACTIONS */}
      <footer className="flex justify-end gap-3">
        <a
          href="/schedules"
          className="px-4 py-2 rounded-xl bg-gray-100/70 hover:bg-gray-200/70 text-gray-700"
        >
          Cancelar
        </a>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#FF3131] text-white font-medium hover:bg-[#e52b2b] transition"
        >
          Guardar cambios
        </button>
      </footer>
    </form>
  );
}
