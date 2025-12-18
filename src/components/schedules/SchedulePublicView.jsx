import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiFetch } from "../../lib/utils/fetch";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { FileImage, FileText, Share2, MessageCircle } from "lucide-react";
import {
  copyWhatsappText,
  exportSchedulePDF,
  exportSchedulePNG,
  shareSchedule,
} from "../../lib/utils/exportSchedule";

/* ======================================================
   EXPORT HELPERS (FORZADO A DESKTOP WIDTH)
====================================================== */
const EXPORT_WIDTH = 900;

async function captureNode(node) {
  const height = node.scrollHeight;
  return await toPng(node, {
    backgroundColor: "#ffffff",
    width: EXPORT_WIDTH,
    height,
    style: { width: `${EXPORT_WIDTH}px`, height: `${height}px` },
    pixelRatio: 2,
  });
}

/* ======================================================
   TABLE
====================================================== */
export function ScheduleTable({ schedules, date }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left whitespace-nowrap">Empleado</th>
            <th className="p-2 text-left whitespace-nowrap">Turno</th>
            <th className="p-2 text-left whitespace-nowrap">Áreas</th>
            <th className="p-2 text-left whitespace-nowrap">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-b last:border-none hover:bg-gray-50 transition">
              <td className="p-2 font-medium whitespace-nowrap">{s.ScheduleEmployee?.name}</td>
              <td className="p-2 whitespace-nowrap">{s.is_rest_day ? "Descanso" : s.ScheduleShift?.name}</td>
              <td className="p-2">{s.areas.map((a) => a.name).join(", ")}</td>
              <td className="p-2 text-gray-600">{s.areas.map((a) => a.description).join(", ")}</td>
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

  useEffect(() => { loadSchedules(); }, [startDate]);

  async function loadSchedules() {
    setLoading(true);
    try {
      const res = await apiFetch(`/schedules/public?start=${startDate}&days=${daysPerPage}`);
      if (res?.success) setSchedules(res.data);
    } finally { setLoading(false); }
  }

  const groupedByDate = schedules.reduce((acc, s) => { (acc[s.date] ||= []).push(s); return acc; }, {});

  return (
    <div className="space-y-5 p-4">
      {/* CONTROLES */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <button
          onClick={() => setStartDate(dayjs(startDate).subtract(daysPerPage, "day").format("YYYY-MM-DD"))}
          className="w-full md:w-auto px-3 py-2 bg-gray-200 rounded"
        >← Anteriores</button>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full md:w-auto border rounded px-3 py-2 text-center"
        />

        <button
          onClick={() => setStartDate(dayjs(startDate).add(daysPerPage, "day").format("YYYY-MM-DD"))}
          className="w-full md:w-auto px-3 py-2 bg-gray-200 rounded"
        >Siguientes →</button>
      </div>

      {loading && <p>Cargando horarios…</p>}

      {!loading && Object.entries(groupedByDate).map(([date, daySchedules]) => (
        <div key={date} id={`schedule-${date}`} className="bg-white rounded-xl p-4 shadow-md">
          {/* HEADER */}
          <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{dayjs(date).format("dddd, DD MMM YYYY")}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => exportSchedulePNG({ date, schedules: daySchedules })}
                className="export-btn bg-blue-100 text-blue-700"
              ><FileImage size={14} /> PNG</button>

              <button
                onClick={() => exportSchedulePDF({ date, schedules: daySchedules })}
                className="export-btn bg-red-100 text-red-700"
              ><FileText size={14} /> PDF</button>

              <button
                onClick={() => shareSchedule(`schedule-${date}`, date)}
                className="export-btn bg-green-100 text-green-700"
              ><Share2 size={14} /> Compartir</button>

              <button
                onClick={async () => { await copyWhatsappText({ date, schedules: daySchedules }); alert("📋 Texto copiado para WhatsApp"); }}
                className="export-btn bg-emerald-100 text-emerald-700"
              ><MessageCircle size={14} /> Copiar WhatsApp</button>
            </div>
          </div>

          <ScheduleTable schedules={daySchedules} date={date} />
        </div>
      ))}
    </div>
  );
}
