import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiFetch } from "../../lib/utils/fetch";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { FileImage, FileText, Share2 } from "lucide-react";

export default function SchedulePublicView() {
  const [schedules, setSchedules] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const daysPerPage = 5;

  useEffect(() => {
    loadSchedules();
  }, [startDate]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/schedules/public?start=${startDate}&days=${daysPerPage}`
      );
      if (res?.success) setSchedules(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prevDays = () => {
    setStartDate(
      dayjs(startDate).subtract(daysPerPage, "day").format("YYYY-MM-DD")
    );
  };

  const nextDays = () => {
    setStartDate(dayjs(startDate).add(daysPerPage, "day").format("YYYY-MM-DD"));
  };

  const groupedByDate = schedules.reduce((acc, s) => {
    (acc[s.date] ||= []).push(s);
    return acc;
  }, {});

  // ================= EXPORT HELPERS =================

  const exportAsPNG = async (elementId, filename) => {
    const node = document.getElementById(elementId);
    if (!node) return;

    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  };

  const exportAsPDF = async (elementId, filename) => {
    const node = document.getElementById(elementId);
    if (!node) return;

    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  };

  const shareSchedule = async (elementId, date) => {
    const node = document.getElementById(elementId);
    if (!node) return;

    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `horario-${date}.png`, {
      type: "image/png",
    });

    const text = `📅 Horario ${dayjs(date).format("dddd DD MMM YYYY")}`;

    // ✅ Web Share API (móviles)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        text,
      });
      return;
    }

    // ❌ Fallback: WhatsApp Web (texto)
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // ================= UI =================

  return (
    <div className="space-y-4 p-4">
      {/* CONTROLES */}
      <div className="flex justify-between items-center">
        <button onClick={prevDays} className="px-3 py-1 bg-gray-200 rounded">
          ← Anteriores
        </button>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <button onClick={nextDays} className="px-3 py-1 bg-gray-200 rounded">
          Siguientes →
        </button>
      </div>

      {loading && <p>Cargando horarios…</p>}

      {!loading && Object.keys(groupedByDate).length === 0 && (
        <p>No hay horarios para estas fechas.</p>
      )}

      {/* TABLAS POR DÍA */}
      {!loading &&
        Object.entries(groupedByDate).map(([date, daySchedules]) => (
          <div
            key={date}
            id={`schedule-${date}`}
            className="bg-white p-4 rounded shadow-md"
          >
            {/* HEADER + BOTONES */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {dayjs(date).format("dddd, DD MMM YYYY")}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    exportAsPNG(`schedule-${date}`, `horario-${date}`)
                  }
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <FileImage size={14} />
                  PNG
                </button>

                <button
                  onClick={() =>
                    exportAsPDF(`schedule-${date}`, `horario-${date}`)
                  }
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <FileText size={14} />
                  PDF
                </button>
                <button
                  onClick={() => shareSchedule(`schedule-${date}`, date)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Share2 size={14} />
                  Compartir
                </button>
              </div>
            </div>

            {/* TABLA */}
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Empleado</th>
                  <th className="p-2 text-left">Turno</th>
                  <th className="p-2 text-left">Áreas</th>
                  <th className="p-2 text-left">Área - desc</th>
                </tr>
              </thead>
              <tbody>
                {daySchedules.map((s) => (
                  <tr key={s.id} className="border-b last:border-none">
                    <td className="p-2">{s.ScheduleEmployee?.name}</td>
                    <td className="p-2">
                      {s.is_rest_day ? "Descanso" : s.ScheduleShift?.name}
                    </td>
                    <td className="p-2">
                      {s.areas.map((a) => a.name).join(", ")}
                    </td>
                    <td className="p-2">
                      {s.areas.map((a) => a.description).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
