// src/components/shifts/ShiftsEditForm.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alerts";
import { redirect } from "../../lib/utils/navigation";
import Loading from "../ui/Loading";
import { CustomTimePicker } from "../layouts/CustomTimePicker";
import Field from "../ui/Field";
import Input from "../ui/Input";

export default function ShiftsEditForm() {
  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState("08");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("17");
  const [endMinute, setEndMinute] = useState("00");
  const [breakTime, setBreakTime] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [id, setId] = useState(null);

  // Limpia el error del campo cuando el usuario escribe/interactúa
  const updateField = (field, setter) => (val) => {
    setter(val);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Completa este campo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shiftId = params.get("id");

    if (!shiftId) {
      showError("ID de turno inválido");
      setLoading(false);
      return;
    }

    setId(shiftId);
  }, []);

  useEffect(() => {
    if (!id) return;
    async function loadShift() {
      try {
        const res = await apiFetch(`/shifts/${id}`);

        if (res?.success) {
          const data = res.data;
          setName(data.name || "");
          setNotes(data.notes || "");
          setBreakTime(data.break_time ?? 0);
          setIsNight(Boolean(data.is_night));

          if (data.start_time) {
            const [h, m] = data.start_time.split(":");
            setStartHour(h.padStart(2, "0"));
            setStartMinute(m ? m.padStart(2, "0") : "00");
          }

          if (data.end_time) {
            const [h, m] = data.end_time.split(":");
            setEndHour(h.padStart(2, "0"));
            setEndMinute(m ? m.padStart(2, "0") : "00");
          }
        } else {
          showError(res?.message || "No se pudo cargar el turno");
        }
      } catch (err) {
        showError(err?.message || "Error cargando el turno");
      } finally {
        setLoading(false);
      }
    }

    loadShift();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const startTimeFormatted = `${startHour}:${startMinute}`;
    const endTimeFormatted = `${endHour}:${endMinute}`;

    try {
      const res = await apiFetch(`/shifts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          start_time: startTimeFormatted,
          end_time: endTimeFormatted,
          break_time: Number(breakTime) || 0,
          is_night: isNight,
          notes,
        }),
      });

      if (res?.success) {
        showSuccess("Turno actualizado correctamente", {
          onClose: () => redirect("/shifts"),
        });
      } else {
        showError(res?.message || "Error actualizando el turno");
      }
    } catch (err) {
      showError(err?.message || "Error al actualizar el turno");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullscreen={false} text="Cargando horario del turno..." />;

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
            Editar turno
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Configuración general de horarios operativos.
          </p>
        </div>

        {/* CAMPOS PRINCIPALES */}
        <div className="space-y-6">
          {/* NOMBRE DEL TURNO */}
          <Field label="Nombre del Turno" error={errors.name}>
            <Input
              value={name}
              onChange={updateField("name", setName)}
              hasError={Boolean(errors.name)}
              placeholder="Ej. Turno Mañana / Rotativo"
            />
          </Field>

          {/* HORA DE INGRESO Y SALIDA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Hora de Ingreso">
              <CustomTimePicker
                hour={startHour}
                minute={startMinute}
                onHourChange={setStartHour}
                onMinuteChange={setStartMinute}
              />
            </Field>

            <Field label="Hora de Salida">
              <CustomTimePicker
                hour={endHour}
                minute={endMinute}
                onHourChange={setEndHour}
                onMinuteChange={setEndMinute}
              />
            </Field>
          </div>

          {/* DESCANSO NO LABORADO */}
          <Field
            label="Descanso No Laborado (Minutos)"
            hint="Este tiempo se descontará del cómputo total de horas trabajadas."
          >
            <Input
              type="number"
              min="0"
              step="15"
              value={breakTime}
              onChange={setBreakTime}
              placeholder="Ej. 120 para 2 horas"
            />
          </Field>

          {/* TOGGLE TURNO NOCTURNO */}
          <div className="flex items-center justify-between bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
            <div>
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Turno nocturno
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Activa esta opción si el turno finaliza al día siguiente
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNight(!isNight)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                isNight ? "bg-[#FF3131]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                  isNight ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* NOTAS */}
          <Field label="Notas u Observaciones" hint="Opcional">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones sobre traslape de personal, recesos o asignación de área..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium outline-none text-gray-900 focus:bg-white focus:border-[#FF3131] focus:ring-4 focus:ring-red-500/10 transition-all duration-200 resize-none placeholder:text-gray-400"
            />
          </Field>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <a
            href="/shifts"
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
            {submitting ? "Guardando cambios…" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}