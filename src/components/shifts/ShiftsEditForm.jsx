import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alert";
import { redirect } from "../../lib/utils/navigation";
import Loading from "../ui/Loading";
import { CustomTimePicker } from "../layouts/CustomTimePicker";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shiftId = params.get("id");

    if (!shiftId) {
      setError("ID de turno inválido");
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
          setError(res?.message || "No se pudo cargar el turno");
        }
      } catch (err) {
        setError(err?.message || "Error cargando el turno");
      } finally {
        setLoading(false);
      }
    }

    loadShift();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#FF3131] flex items-center justify-center font-bold text-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Editar Turno</h1>
            <p className="text-xs text-gray-500">Configuración general de horarios operativos</p>
          </div>
        </div>

        <a
          href="/shifts"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a turnos
        </a>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-6"
      >
        {/* ALERTS */}
        {error && (
          <div className="flex items-center gap-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOMBRE DEL TURNO */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Nombre del Turno
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Turno Mañana / Rotativo"
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131] transition"
            />
          </div>

          {/* HORA DE INGRESO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Hora de Ingreso
            </label>
            <CustomTimePicker
              hour={startHour}
              minute={startMinute}
              onHourChange={setStartHour}
              onMinuteChange={setStartMinute}
            />
          </div>

          {/* HORA DE SALIDA */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Hora de Salida
            </label>
            <CustomTimePicker
              hour={endHour}
              minute={endMinute}
              onHourChange={setEndHour}
              onMinuteChange={setEndMinute}
            />
          </div>

          {/* TIEMPO DE DESCANSO (MINUTOS) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Descanso No Laborado (Minutos)
            </label>
            <input
              type="number"
              min="0"
              step="15"
              value={breakTime}
              onChange={(e) => setBreakTime(e.target.value)}
              placeholder="Ej. 120 para 2 horas"
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131] transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Este tiempo se descontará del cómputo total de horas trabajadas.
            </p>
          </div>

          {/* TURNO NOCTURNO */}
          <div className="flex items-center pt-4">
            <label className="relative flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isNight}
                onChange={(e) => setIsNight(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF3131] focus:ring-[#FF3131]/20 border-gray-300 transition"
              />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                ¿Es turno nocturno?
              </span>
            </label>
          </div>

          {/* NOTAS */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Notas u Observaciones
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones sobre traslape de personal, recesos o asignación de área..."
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl p-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131] transition placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <a
            href="/shifts"
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl transition"
          >
            Cancelar
          </a>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF3131] hover:bg-[#e02b2b] rounded-xl transition shadow-md shadow-[#FF3131]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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