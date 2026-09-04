import { useState, useEffect } from "react";
import { updateScheduleAttendance } from "../../lib/api/schedules"; // Ajusta la ruta según tu estructura de carpetas
import { showSuccess, showError } from "../../lib/utils/alerts";

export default function ScheduleAttendanceModal({ isOpen, onClose, schedule, onSuccess }) {
  const [attendanceStatus, setAttendanceStatus] = useState("asistio");
  const [absenceReason, setAbsenceReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (schedule) {
      console.log("Objeto schedule recibido:", schedule);
      setAttendanceStatus(schedule.attendance_status || "asistio");
      setAbsenceReason(schedule.absence_reason || "");
    }
  }, [schedule]);

  if (!isOpen || !schedule) return null;

  const scheduleId = schedule.id; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        attendance_status: attendanceStatus,
        absence_reason: absenceReason || null,
      };

      // Usando la función del archivo de servicios compartidos
      const res = await updateScheduleAttendance(scheduleId, payload);

      if (res?.success) {
        showSuccess("Estado de asistencia actualizado correctamente");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showError(res?.message || "Error al actualizar la asistencia");
      }
    } catch (err) {
      showError(err?.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Control de Asistencia</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Empleado: <span className="font-semibold text-gray-700">{schedule.ScheduleEmployee?.name || "N/A"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Estado de Asistencia
            </label>
            <select
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="asistio">Asistió</option>
              <option value="falta_justificada">Falta Justificada</option>
              <option value="falta_injustificada">Falta Injustificada</option>
              <option value="sin_reemplazo">Sin Reemplazo Disponible</option>
            </select>
          </div>

          {attendanceStatus !== "asistio" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Motivo de la Falta / Incidencia
              </label>
              <textarea
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
                placeholder="Ej: Calamidad doméstica, enfermedad reportada..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}