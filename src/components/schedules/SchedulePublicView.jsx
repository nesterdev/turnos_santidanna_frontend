import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiFetch } from "../../lib/utils/fetch";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { FileImage, FileText, Share2 } from "lucide-react";

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
    style: {
      width: `${EXPORT_WIDTH}px`,
      height: `${height}px`,
    },
    pixelRatio: 2,
  });
}

async function exportAsPNG(elementId, filename) {
  const node = document.getElementById(elementId);
  if (!node) return;

  const dataUrl = await captureNode(node);
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

async function exportAsPDF(elementId, filename) {
  const node = document.getElementById(elementId);
  if (!node) return;

  const dataUrl = await captureNode(node);
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(dataUrl);
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  let position = 0;
  let heightLeft = imgHeight;

  pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

async function shareSchedule(elementId, date) {
  const node = document.getElementById(elementId);
  if (!node) return;

  const dataUrl = await captureNode(node);
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], `horario-${date}.png`, {
    type: "image/png",
  });

  const text = `📅 Horario ${dayjs(date).format("dddd DD MMM YYYY")}`;

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], text });
    return;
  }

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

/* ======================================================
   SUBCOMPONENTS
====================================================== */

function DesktopTable({ schedules }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Empleado</th>
            <th className="p-2 text-left">Turno</th>
            <th className="p-2 text-left">Áreas</th>
            <th className="p-2 text-left">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr
              key={s.id}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="p-2 font-medium">{s.ScheduleEmployee?.name}</td>
              <td className="p-2">
                {s.is_rest_day ? "Descanso" : s.ScheduleShift?.name}
              </td>
              <td className="p-2">{s.areas.map((a) => a.name).join(", ")}</td>
              <td className="p-2 text-gray-600">
                {s.areas.map((a) => a.description).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ schedules }) {
  return (
    <div className="md:hidden space-y-3">
      {schedules.map((s) => (
        <div
          key={s.id}
          className="bg-gray-50 border rounded-xl p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">
              {s.ScheduleEmployee?.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              {s.is_rest_day ? "Descanso" : s.ScheduleShift?.name}
            </span>
          </div>

          <div className="mt-2 text-sm">
            <p>
              <span className="font-medium text-gray-600">Áreas:</span>{" "}
              {s.areas.map((a) => a.name).join(", ")}
            </p>

            <p className="mt-1 text-gray-500">
              {s.areas.map((a) => a.description).join(", ")}
            </p>
          </div>
        </div>
      ))}
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
      const res = await apiFetch(
        `/schedules/public?start=${startDate}&days=${daysPerPage}`
      );
      if (res?.success) setSchedules(res.data);
    } finally {
      setLoading(false);
    }
  }

  const groupedByDate = schedules.reduce((acc, s) => {
    (acc[s.date] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-5 p-4">
      {/* CONTROLES */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* BOTÓN ANTERIOR */}
        <button
          onClick={() =>
            setStartDate(
              dayjs(startDate).subtract(daysPerPage, "day").format("YYYY-MM-DD")
            )
          }
          className="w-full md:w-auto px-3 py-2 bg-gray-200 rounded"
        >
          ← Anteriores
        </button>

        {/* FECHA */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full md:w-auto border rounded px-3 py-2 text-center"
        />

        {/* BOTÓN SIGUIENTE */}
        <button
          onClick={() =>
            setStartDate(
              dayjs(startDate).add(daysPerPage, "day").format("YYYY-MM-DD")
            )
          }
          className="w-full md:w-auto px-3 py-2 bg-gray-200 rounded"
        >
          Siguientes →
        </button>
      </div>

      {loading && <p>Cargando horarios…</p>}

      {!loading &&
        Object.entries(groupedByDate).map(([date, daySchedules]) => (
          <div
            key={date}
            id={`schedule-${date}`}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            {/* HEADER */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {dayjs(date).format("dddd, DD MMM YYYY")}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    exportAsPNG(`schedule-${date}`, `horario-${date}`)
                  }
                  className="export-btn bg-blue-100 text-blue-700"
                >
                  <FileImage size={14} /> PNG
                </button>

                <button
                  onClick={() =>
                    exportAsPDF(`schedule-${date}`, `horario-${date}`)
                  }
                  className="export-btn bg-red-100 text-red-700"
                >
                  <FileText size={14} /> PDF
                </button>

                <button
                  onClick={() => shareSchedule(`schedule-${date}`, date)}
                  className="export-btn bg-green-100 text-green-700"
                >
                  <Share2 size={14} /> Compartir
                </button>
              </div>
            </div>

            <DesktopTable schedules={daySchedules} />
            <MobileCards schedules={daySchedules} />
          </div>
        ))}
    </div>
  );
}
