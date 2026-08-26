import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { user } from "../../lib/stores/userStore";
import { apiFetch } from "../../lib/utils/fetch";
import CustomDatePicker from "../ui/CustomDatePicker";
import Loading from "../ui/Loading";
import { ScheduleTable } from "./SchedulePublicView";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";

dayjs.locale("es");

export default function EmployeeScheduleView() {
  const currentUser = useStore(user);
  
  // Estado para evitar el mismatch de hidratación SSR/Cliente
  const [isMounted, setIsMounted] = useState(false);

  // Modos: "current" (Semana actual / selección activa) o "previous" (Semana anterior)
  const [viewMode, setViewMode] = useState("current");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Días a consultar (6 días)
  const daysRange = 6;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadEmployeeSchedules();
    }
  }, [startDate, viewMode, currentUser]);

  async function loadEmployeeSchedules() {
    setLoading(true);
    try {
      let fetchStart = startDate;
      if (viewMode === "previous") {
        fetchStart = dayjs().subtract(7, "day").startOf("week").add(1, "day").format("YYYY-MM-DD");
      }

      const res = await apiFetch(`/schedules/public?start=${fetchStart}&days=${daysRange}`);
      if (res?.success) {
        console.log("respuesta de schedule",res)
        const mySchedules = (res.data || []).filter((s) => {
          const emp = s.ScheduleEmployee;
          return emp && (emp.id === currentUser?.id || emp.email === currentUser?.email);
        });
        setSchedules(mySchedules);
      }
    } finally {
      setLoading(false);
    }
  }

  const groupedByDate = schedules.reduce((acc, s) => {
    (acc[s.date] ||= []).push(s);
    return acc;
  }, {});

  const endDateCalculated = dayjs(startDate).add(daysRange - 1, "day").format("DD [de] MMMM");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER DE BIENVENIDA */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#FF3131] uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-full">
            Panel de Empleado
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-2">
            Hola, {isMounted ? (currentUser?.name || "Empleado") : "Empleado"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Consulta la asignación de tus turnos, descansos y áreas de trabajo.
          </p>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => {
              setViewMode("previous");
              setStartDate(dayjs().subtract(7, "day").startOf("week").add(1, "day").format("YYYY-MM-DD"));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "previous"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Semana Anterior
          </button>
          <button
            onClick={() => {
              setViewMode("current");
              setStartDate(dayjs().format("YYYY-MM-DD"));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "current"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Semana Actual / Siguiente
          </button>
        </div>
      </div>

      {/* CONTROLES DE FECHA */}
      {viewMode === "current" && (
        <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <Calendar size={16} className="text-[#FF3131]" />
            <span>
              Mostrando 6 días desde: <strong>{dayjs(startDate).format("DD/MM/YYYY")}</strong> hasta <strong>{endDateCalculated}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setStartDate(dayjs(startDate).subtract(1, "day").format("YYYY-MM-DD"))}
              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/60 transition"
              title="Día anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <CustomDatePicker
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              label=""
            />

            <button
              onClick={() => setStartDate(dayjs(startDate).add(1, "day").format("YYYY-MM-DD"))}
              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/60 transition"
              title="Día siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ESTADO DE CARGA */}
      {loading && <Loading fullscreen={false} text="Cargando tus turnos asignados…" />}

      {/* SIN RESULTADOS */}
      {!loading && Object.keys(groupedByDate).length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100/80 p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Clock size={20} />
          </div>
          <p className="text-xs font-semibold text-gray-700">No tienes turnos programados</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            No se encontraron asignaciones registradas a tu nombre para el rango seleccionado.
          </p>
        </div>
      )}

      {/* DETALLE DE TURNOS POR DÍA */}
      {!loading &&
        Object.entries(groupedByDate).map(([date, daySchedules]) => (
          <div
            key={date}
            className="bg-white rounded-2xl border border-gray-100/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4"
          >
            <div className="border-b border-gray-50 pb-3">
              <h3 className="text-sm font-bold text-gray-900 capitalize">
                {dayjs(date).format("dddd, DD [de] MMMM YYYY")}
              </h3>
            </div>

            <ScheduleTable schedules={daySchedules} />
          </div>
        ))}
    </div>
  );
}