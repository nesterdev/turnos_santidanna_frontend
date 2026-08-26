import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { apiFetch } from "../../lib/utils/fetch";
import { FileImage, FileText, Share2, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  copyWhatsappText,
  exportSchedulePDF,
  exportSchedulePNG,
  shareSchedule,
} from "../../lib/utils/exportSchedule";
import Loading from "../ui/Loading";
import CustomDatePicker from "../ui/CustomDatePicker"; // Ajusta la ruta a tu componente

dayjs.locale("es");

/* ======================================================
   TABLE COMPONENT
====================================================== */
export function ScheduleTable({ schedules }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <th className="pb-3 px-3">EMPLEADO</th>
            <th className="pb-3 px-3">TURNO</th>
            <th className="pb-3 px-3">ÁREAS</th>
            <th className="pb-3 px-3">DESCRIPCIÓN</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-xs">
          {schedules.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="py-3.5 px-3 font-semibold text-gray-900">
                {s.ScheduleEmployee?.name || "—"}
              </td>
              <td className="py-3.5 px-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    s.is_rest_day
                      ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {s.is_rest_day ? "Descanso" : s.ScheduleShift?.name || "Asignado"}
                </span>
              </td>
              <td className="py-3.5 px-3 text-gray-700 font-medium">
                {s.areas && s.areas.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {s.areas.map((a, i) => (
                      <span
                        key={i}
                        className="inline-block bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded text-[11px]"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="py-3.5 px-3 text-gray-500 max-w-xs truncate">
                {s.areas && s.areas.length > 0
                  ? s.areas.map((a) => a.description).filter(Boolean).join(", ") || "—"
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function SchedulePublicView() {
  const [schedules, setSchedules] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const daysPerPage = 5;

  useEffect(() => {
    loadSchedules();
  }, [startDate]);

  async function loadSchedules() {
    setLoading(true);
    try {
      const res = await apiFetch(`/schedules/public?start=${startDate}&days=${daysPerPage}`);
      if (res?.success) setSchedules(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  const groupedByDate = schedules.reduce((acc, s) => {
    (acc[s.date] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* BARRA DE NAVEGACIÓN DE FECHAS */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() =>
            setStartDate(dayjs(startDate).subtract(daysPerPage, "day").format("YYYY-MM-DD"))
          }
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/60 transition"
        >
          <ChevronLeft size={16} />
          Anteriores
        </button>

        {/* COMPONENTE REUTILIZADO CUSTOM DATEPICKER */}
        <CustomDatePicker
          value={startDate}
          onChange={(newDate) => setStartDate(newDate)}
          label=""
        />

        <button
          onClick={() =>
            setStartDate(dayjs(startDate).add(daysPerPage, "day").format("YYYY-MM-DD"))
          }
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/60 transition"
        >
          Siguientes
          <ChevronRight size={16} />
        </button>
      </div>

      {/* CARGANDO */}
      {loading && <Loading fullscreen={false} text="Cargando horarios públicos…" />}

      {/* EMPTY STATE */}
      {!loading && Object.keys(groupedByDate).length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100/80 p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-semibold text-gray-700">No hay horarios programados</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            No se encontraron turnos asignados para las fechas seleccionadas.
          </p>
        </div>
      )}

      {/* LISTA DE HORARIOS POR DÍA */}
      {!loading &&
        Object.entries(groupedByDate).map(([date, daySchedules]) => (
          <div
            key={date}
            id={`schedule-${date}`}
            className="bg-white rounded-2xl border border-gray-100/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4"
          >
            {/* CABECERA DE DÍA Y ACCIONES DE EXPORTACIÓN */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 capitalize">
                  {dayjs(date).format("dddd, DD [de] MMMM YYYY")}
                </h3>
                <span className="text-[11px] text-gray-400 font-medium">
                  {daySchedules.length} turno(s) registrado(s)
                </span>
              </div>

              {/* BOTONES DE EXPORTACIÓN */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  title="Exportar como Imagen"
                  onClick={() => exportSchedulePNG({ date, schedules: daySchedules })}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-100 transition"
                >
                  <FileImage size={15} />
                </button>

                <button
                  title="Exportar como PDF"
                  onClick={() => exportSchedulePDF({ date, schedules: daySchedules })}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-100 transition"
                >
                  <FileText size={15} />
                </button>

                <button
                  title="Compartir"
                  onClick={() => shareSchedule(`schedule-${date}`, date)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 border border-gray-100 transition"
                >
                  <Share2 size={15} />
                </button>

                <button
                  onClick={async () => {
                    await copyWhatsappText({ date, schedules: daySchedules });
                    alert("📋 Texto copiado para WhatsApp");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200/50 transition ml-1"
                >
                  <MessageCircle size={14} />
                  Copiar
                </button>
              </div>
            </div>

            {/* TABLA DE DETALLE */}
            <ScheduleTable schedules={daySchedules} />
          </div>
        ))}
    </div>
  );
}