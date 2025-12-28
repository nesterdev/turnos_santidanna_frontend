import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  exportSchedulePDF,
  exportSchedulePNG,
  copyWhatsappText,
  shareSchedule,
} from "../../lib/utils/exportSchedule";
import { FileImage, FileText, Share2, MessageCircle } from "lucide-react";
import { apiFetch } from "../../lib/utils/fetch";
import { ScheduleTable } from "./SchedulePublicView";
import Loading from "../ui/Loading";

export default function ScheduleDayCard() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState(null);

  // LEER QUERY PARAM
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("date");

    if (!empId) {
      setError("ID de empleado inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);

  useEffect(() => {
    if (!id) return;
    loadSchedule();
  }, [id]);

  async function loadSchedule() {
    setLoading(true);
    try {
      const res = await apiFetch(`/schedules/public/${id}`);
      if (res?.success) setSchedules(res.data);
    } finally {
      setLoading(false);
    }
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!id || loading) return <Loading fullscreen text="Cargando horario…" />;
  if (!schedules.length)
    return <p>No hay horarios para {dayjs(id).format("DD/MM/YYYY")}</p>;

  return (
    <div id={`schedule-${id}`} className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          {dayjs(id).format("dddd, DD MMM YYYY")}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() =>
              exportSchedulePNG({ date: id, schedules })
            }
            className="export-btn bg-blue-100 text-blue-700"
          >
            <FileImage size={14} />
          </button>
          <button
            onClick={() =>
              exportSchedulePDF({ date: id, schedules })
            }
            className="export-btn bg-red-100 text-red-700"
          >
            <FileText size={14} />
          </button>
          <button
            onClick={() => shareSchedule(`schedule-${id}`, id)}
            className="export-btn bg-green-100 text-green-700"
          >
            <Share2 size={14} /> Compartir
          </button>
          <button
            onClick={async () => {
              await copyWhatsappText({ date: id, schedules });
              alert("📋 Texto copiado para WhatsApp");
            }}
            className="export-btn bg-emerald-100 text-emerald-700"
          >
            <MessageCircle size={14} /> Copiar
          </button>
        </div>
      </div>

      <ScheduleTable schedules={schedules} date={id} />
    </div>
  );
}
