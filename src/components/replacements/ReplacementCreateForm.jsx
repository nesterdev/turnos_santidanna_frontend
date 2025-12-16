import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import Field from "../ui/Field";
import SelectCard from "../ui/SelectCard";

export default function ReplacementCreateForm() {
  const [absentEmployees, setAbsentEmployees] = useState([]); // empleados con turno ese día
  const [replacementEmployees, setReplacementEmployees] = useState([]); // libres
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    date: "",
    employee_id: "",
    replaced_by: "",
    schedule_id: "",
    notes: "",
  });

  // -------------------------
  // 1) Cuando cambia la fecha: traer empleados que tienen turno (with-schedule)
  // -------------------------
  useEffect(() => {
    if (!form.date) {
      setAbsentEmployees([]);
      setReplacementEmployees([]);
      setSchedules([]);
      setForm((f) => ({
        ...f,
        employee_id: "",
        replaced_by: "",
        schedule_id: "",
      }));
      return;
    }

    async function loadReplacements() {
      setLoading(true);
      setError("");
      try {
        console.log("➡️ loadReplacements date:", form.date);
        const res = await apiFetch(
          `/employees/with-schedule?date=${form.date}`
        );
        const list = res?.data ?? [];
        console.log("⬅️ with-schedule response:", list);
        setAbsentEmployees(list);
        // reset dependent fields
        setReplacementEmployees([]);
        setSchedules([]);
        setForm((f) => ({
          ...f,
          employee_id: "",
          replaced_by: "",
          schedule_id: "",
        }));
      } catch (err) {
        console.error("Error cargando empleados con turno:", err);
        setError("No se pudieron cargar empleados con turno ese día.");
      } finally {
        setLoading(false);
      }
    }

    loadReplacements();
  }, [form.date]);

  // -------------------------
  // 2) Cuando cambia el empleado ausente o la fecha: cargar empleados libres y horarios del ausente
  // -------------------------
  useEffect(() => {
    // sólo si hay fecha y empleado seleccionado
    if (!form.date || !form.employee_id) {
      setSchedules([]);
      setReplacementEmployees([]);
      return;
    }

    // llamamos ambos en paralelo
    loadFreeEmployees();
    loadSchedulesForAbsent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.employee_id, form.date]);

  // free employees (usa endpoint que ya tienes)
  async function loadFreeEmployees() {
    try {
      console.log(
        "➡️ loadFreeEmployees date, skip:",
        form.date,
        form.employee_id
      );
      const res = await apiFetch(
        `/employees/free?date=${form.date}&skip=${form.employee_id}`
      );
      const list = res?.data ?? [];
      console.log(
        "⬅️ freeEmployees response:",
        list.map((l) => l.id)
      );
      setReplacementEmployees(list);
    } catch (err) {
      console.error("Error cargando empleados libres:", err);
      setReplacementEmployees([]);
      setError("No se pudieron cargar los empleados libres.");
    }
  }

  // schedules del empleado ausente PARA LA FECHA SELECCIONADA
  // dentro del componente React
  async function loadSchedulesForAbsent() {
    try {
      const start = form.date;
      const end = form.date;
      console.log("➡️ loadSchedulesForAbsent", {
        start,
        end,
        employee_id: form.employee_id,
      });

      const res = await apiFetch(
        `/schedules?start=${start}&end=${end}&employee_id=${form.employee_id}`
      );
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
        ? res.data
        : [];
      console.log("⬅️ schedules response (raw):", list);

      // Filtrar por seguridad: solo schedules cuyo employee_id coincida con el ausente
      const filtered = list.filter(
        (s) => Number(s.employee_id) === Number(form.employee_id)
      );

      // Evitar duplicados por id
      const seen = new Set();
      const unique = filtered.filter((s) => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });

      const normalized = unique.map((s) => ({
        ...s,
        shift_name:
          s.ScheduleShift?.name ||
          s.shift_name ||
          `Turno #${s.shift_id || "?"}`,
      }));

      console.log("➡️ schedules normalized (for select):", normalized);
      setSchedules(normalized);
      setForm((f) => ({ ...f, schedule_id: "" }));
    } catch (err) {
      console.error("Error cargando schedules del ausente:", err);
      setSchedules([]);
    }
  }

  // -------------------------
  // Submit
  // -------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      // validaciones front
      if (!form.date || !form.employee_id || !form.replaced_by) {
        setError("Fecha, empleado ausente y reemplazo son requeridos.");
        return;
      }

      const payload = {
        employee_id: Number(form.employee_id),
        replaced_by: Number(form.replaced_by),
        date: form.date,
        notes: form.notes || null,
        schedule_id: form.schedule_id ? Number(form.schedule_id) : null,
      };

      console.log("➡️ POST /replacements payload:", payload);
      await apiFetch("/replacements", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      window.location.href = "/replacements";
    } catch (err) {
      console.error("Error creando replacement:", err);
      setError(err?.message || "Error creando el reemplazo.");
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // si cambias employee_id limpiar schedule/replacer
    if (field === "employee_id") {
      setReplacementEmployees([]);
      setSchedules([]);
      setForm((f) => ({ ...f, replaced_by: "", schedule_id: "" }));
    }
    // si cambias date limpiar todo relacionado
    if (field === "date") {
      setAbsentEmployees([]);
      setReplacementEmployees([]);
      setSchedules([]);
      setForm((f) => ({
        ...f,
        employee_id: "",
        replaced_by: "",
        schedule_id: "",
      }));
    }
  }

  return (
    <>
      {error && (
        <div className="max-w-xl mx-auto mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="
        max-w-2xl mx-auto
        bg-white/80 backdrop-blur-xl
        rounded-2xl border border-gray-100
        shadow-sm
        p-8 space-y-7
      "
      >
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Crear reemplazo
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Asigna un reemplazo para un turno específico
          </p>
        </div>

        {/* FECHA */}
        <Field label="Fecha">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className="
            w-full rounded-xl border border-gray-200
            px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-black/10
          "
          />
        </Field>

        {/* EMPLEADO AUSENTE */}
        {form.date && (
          <Field
            label="Empleado ausente"
            hint="Empleados que tienen turno asignado ese día"
          >
            {loading && <p className="text-sm text-gray-500">Cargando…</p>}

            {!loading && absentEmployees.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay empleados con turno ese día.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {absentEmployees.map((e) => (
                <SelectCard
                  key={e.id}
                  title={e.name}
                  description={
                    e.EmployeeSchedules?.length
                      ? `Turno: ${e.EmployeeSchedules[0].date}`
                      : null
                  }
                  active={String(form.employee_id) === String(e.id)}
                  onClick={() => updateField("employee_id", e.id)}
                />
              ))}
            </div>
          </Field>
        )}

        {/* REEMPLAZO */}
        {form.employee_id && (
          <Field label="Reemplazado por" hint="Empleados libres y disponibles">
            {replacementEmployees.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay empleados disponibles.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {replacementEmployees.map((e) => (
                <SelectCard
                  key={e.id}
                  title={e.name}
                  active={String(form.replaced_by) === String(e.id)}
                  onClick={() => updateField("replaced_by", e.id)}
                />
              ))}
            </div>
          </Field>
        )}

        {/* TURNO */}
        {form.employee_id && schedules.length > 0 && (
          <Field label="Turno del empleado ausente">
            <div className="grid grid-cols-1 gap-3">
              {schedules.map((s) => (
                <SelectCard
                  key={s.id}
                  title={s.shift_name}
                  description={
                    s.ScheduleShift?.start_time
                      ? `${s.ScheduleShift.start_time} – ${s.ScheduleShift.end_time} · ${s.date}`
                      : s.date
                  }
                  active={String(form.schedule_id) === String(s.id)}
                  onClick={() => updateField("schedule_id", s.id)}
                />
              ))}
            </div>
          </Field>
        )}

        {/* NOTAS */}
        <Field label="Notas" hint="Opcional">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="
            w-full rounded-xl border border-gray-200
            px-4 py-2.5 text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-black/10
          "
          />
        </Field>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <a
            href="/replacements"
            className="
            px-5 py-2.5 text-sm rounded-xl
            border border-gray-200
            text-gray-700 hover:bg-gray-50 transition
          "
          >
            Cancelar
          </a>

          <button
            type="submit"
            className="
            px-5 py-2.5 text-sm rounded-xl
            bg-black text-white
            hover:bg-gray-900 transition
            shadow-sm
          "
          >
            Crear reemplazo
          </button>
        </div>
      </form>
    </>
  );
}
