import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { user } from "../../lib/stores/userStore";
import { apiFetch } from "../../lib/utils/fetch";
import Loading from "../ui/Loading";
import {
  Check,
  X,
  Send,
  CalendarOff,
  AlertCircle,
  Lock,
  Clock,
  Info,
  CalendarDays,
  ShieldAlert,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";

const DAYS_OF_WEEK = [
  { key: "lunes", label: "Lunes", short: "LUN" },
  { key: "martes", label: "Martes", short: "MAR" },
  { key: "miercoles", label: "Miércoles", short: "MIÉ" },
  { key: "jueves", label: "Jueves", short: "JUE" },
  { key: "viernes", label: "Viernes", short: "VIE" },
  { key: "sabado", label: "Sábado", short: "SÁB" },
  { key: "domingo", label: "Domingo", short: "DOM" }
];

const REVERSE_DAY_MAP = { 1: "lunes", 2: "martes", 3: "miercoles", 4: "jueves", 5: "viernes", 6: "sabado", 0: "domingo" };
const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Correos exentos de las reglas de restricciones de descanso (personal de solo fines de semana)
const EXEMPT_EMAILS = [
  "tcncarlos392@gmail.com",
  "dannafer_2000@gmail.com",
  "Paolaandreacava08@gmail.com",
  "a16760480@gmail.com",
  "lauravalentinayara242@gmail.com",
  "karolayaparicio2008@gmail.com"
];

export default function MyAvailabilityForm() {
  const currentUser = useStore(user);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [statusData, setStatusData] = useState(null);

  const [daysState, setDaysState] = useState({
    lunes: { isAvailable: true, notes: "" },
    martes: { isAvailable: true, notes: "" },
    miercoles: { isAvailable: true, notes: "" },
    jueves: { isAvailable: true, notes: "" },
    viernes: { isAvailable: true, notes: "" },
    sabado: { isAvailable: true, notes: "" },
    domingo: { isAvailable: true, notes: "" }
  });

  // Verificar si el usuario actual está exento basado en su correo
  const isExemptUser = currentUser?.email && EXEMPT_EMAILS.includes(currentUser.email);
  const maxAllowedRest = isExemptUser ? 5 : 2;

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchMyAvailabilityStatus = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/availability/my-status?employeeId=${currentUser.id}`);

        if (res?.success) {
          setStatusData(res);
          const { isWindowOpen, nextWeek } = res;

          if (!isWindowOpen) {
            setIsLocked(true);
          } else if (nextWeek.hasSubmitted) {
            setIsLocked(true);
            setFeedback({
              type: "info",
              text: "Tu disponibilidad para la próxima semana ya fue registrada. Para modificaciones, contacta a tu supervisor."
            });
          }

          if (nextWeek.availabilities && nextWeek.availabilities.length > 0) {
            const updatedState = { ...daysState };
            nextWeek.availabilities.forEach((item) => {
              const dayKey = REVERSE_DAY_MAP[item.day_of_week];
              if (dayKey) {
                updatedState[dayKey] = {
                  isAvailable: Boolean(item.available),
                  notes: item.notes || ""
                };
              }
            });
            setDaysState(updatedState);
          }
        }
      } catch (err) {
        console.error("Error al consultar estado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAvailabilityStatus();
  }, [currentUser?.id]);

  const unavailableCount = Object.values(daysState).filter((day) => !day.isAvailable).length;

  const checkConsecutiveRest = (targetState) => {
    const totalDays = DAYS_OF_WEEK.length;
    for (let i = 0; i < totalDays; i++) {
      const currentDayKey = DAYS_OF_WEEK[i].key;
      const nextDayKey = DAYS_OF_WEEK[(i + 1) % totalDays].key;
      if (!targetState[currentDayKey].isAvailable && !targetState[nextDayKey].isAvailable) {
        return true;
      }
    }
    return false;
  };

  const toggleDay = (dayKey) => {
    if (isLocked) return;
    const isCurrentlyAvailable = daysState[dayKey].isAvailable;

    if (isCurrentlyAvailable && unavailableCount >= maxAllowedRest) {
      setFeedback({
        type: "warning",
        text: isExemptUser
          ? "Límite alcanzado: Máximo 5 días de descanso permitidos por semana."
          : "Límite alcanzado: Máximo 2 días de descanso permitidos por semana."
      });
      return;
    }

    const nextState = {
      ...daysState,
      [dayKey]: { ...daysState[dayKey], isAvailable: !isCurrentlyAvailable }
    };

    // Validar descanso consecutivo solo si NO es un usuario exento
    if (!isExemptUser && isCurrentlyAvailable && checkConsecutiveRest(nextState)) {
      setFeedback({
        type: "warning",
        text: "Regla de descanso: No se permiten días de descanso consecutivos."
      });
      return;
    }

    setFeedback(null);
    setDaysState(nextState);
  };

  const handleNoteChange = (dayKey, notes) => {
    if (isLocked) return;
    setDaysState((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], notes }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setFeedback(null);

    const minRest = isExemptUser ? 0 : 1;
    if (unavailableCount < minRest || unavailableCount > maxAllowedRest) {
      setFeedback({
        type: "warning",
        text: isExemptUser
          ? "Debes programar una cantidad válida de días de descanso."
          : "Debes programar entre 1 y 2 días de descanso."
      });
      return;
    }

    if (!isExemptUser && checkConsecutiveRest(daysState)) {
      setFeedback({
        type: "warning",
        text: "No se permiten 2 días consecutivos de descanso."
      });
      return;
    }

    setSubmitting(true);

    const payload = {
      employeeId: currentUser?.id,
      availabilities: Object.entries(daysState).map(([dayOfWeek, config]) => ({
        dayOfWeek,
        isAvailable: config.isAvailable,
        notes: config.notes
      }))
    };

    try {
      const res = await apiFetch("/availability/bulk", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res?.success) {
        setIsLocked(true);
        setFeedback({
          type: "success",
          text: "¡Disponibilidad guardada con éxito para la próxima semana!"
        });
      } else {
        setFeedback({
          type: "error",
          text: res?.message || "Error al procesar la solicitud."
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: "Error de conexión con el servidor."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysUntilFriday = (dayOfWeek) => {
    if (dayOfWeek < 5 && dayOfWeek > 1) return 5 - dayOfWeek;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loading fullscreen={false} size="md" />
      </div>
    );
  }

  const todayDayName = statusData ? DAY_NAMES[statusData.currentDayOfWeek] : "";
  const daysToFriday = statusData ? getDaysUntilFriday(statusData.currentDayOfWeek) : 0;
  const currentWeekInfo = statusData?.currentWeek;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">

      {/* 1. CLEAN ENTERPRISE PAGE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
            <Clock size={13} className="text-[#FF3131]" />
            <span>Hoy es <strong className="text-slate-900">{todayDayName}</strong> (Hora Colombia)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Gestión de Agenda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Configura tu disponibilidad semanal dentro de la ventana habilitada (Viernes a Lunes).
            {isExemptUser && <span className="block text-indigo-600 font-semibold mt-1">✨ Modo Fin de Semana (Exento de restricciones estándar)</span>}
          </p>
        </div>

        {/* STATUS BADGE */}
        <div className="shrink-0">
          {statusData?.isWindowOpen ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 px-4 py-3 rounded-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Habilitado</p>
                <p className="text-[11px] text-emerald-600">Ventana abierta</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200/80 px-4 py-3 rounded-xl">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Lock size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Ventana Cerrada</p>
                <p className="text-[11px] text-amber-700">Abre en {daysToFriday} {daysToFriday === 1 ? "día" : "días"} (Viernes)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SEMANA EN CURSO */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
              <CalendarDays size={16} />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Estado Semana en Curso <span className="text-slate-400 font-medium">({currentWeekInfo?.weekStart})</span>
            </span>
          </div>
          {currentWeekInfo?.hasSubmitted && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Confirmado
            </span>
          )}
        </div>

        {currentWeekInfo?.hasSubmitted ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
            {currentWeekInfo.availabilities.map((item) => {
              const dayObj = DAYS_OF_WEEK.find((d) => REVERSE_DAY_MAP[item.day_of_week] === d.key);
              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    item.available
                      ? "bg-slate-50 border-slate-200/70 text-slate-700"
                      : "bg-red-50/80 border-red-200 text-red-900"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase text-slate-400">{dayObj?.short}</p>
                  <p className={`text-xs font-bold mt-0.5 ${item.available ? "text-slate-800" : "text-red-600"}`}>
                    {item.available ? "Trabaja" : "Descanso"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Sin registro explícito para esta semana. Cuentas con <strong>disponibilidad general activa</strong>.
            </p>
          </div>
        )}
      </div>

      {/* 3. FORMULARIO PRÓXIMA SEMANA */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">

        {/* HEADER DEL FORMULARIO CON COUNTER COMPACTO */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Próxima Semana ({statusData?.nextWeek?.weekStart})
              </h2>
              {isLocked && (
                <span className="p-1 bg-slate-200/80 text-slate-600 rounded-md" title="Formulario Bloqueado">
                  <Lock size={12} />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic en una tarjeta para alternar entre Disponibilidad y Descanso.
            </p>
          </div>

          {/* KPI BAR RESUMEN */}
          <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs flex items-center gap-4 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2.5">
              <CalendarOff size={16} className={unavailableCount > 0 ? "text-[#FF3131]" : "text-slate-400"} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Descansos</p>
                <p className="text-xs font-black text-slate-900">{unavailableCount} de {maxAllowedRest} máx.</p>
              </div>
            </div>

            {!isExemptUser && (
              <div className="flex gap-1.5 border-l border-slate-100 pl-4">
                <div className={`w-2 h-5 rounded-full transition-all ${unavailableCount >= 1 ? "bg-[#FF3131]" : "bg-slate-200"}`} />
                <div className={`w-2 h-5 rounded-full transition-all ${unavailableCount === 2 ? "bg-[#FF3131]" : "bg-slate-200"}`} />
              </div>
            )}
          </div>
        </div>

        {/* FEEDBACK MSG */}
        {feedback && (
          <div
            className={`m-5 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : feedback.type === "info"
                  ? "bg-blue-50 text-blue-900 border border-blue-200"
                  : feedback.type === "warning"
                    ? "bg-amber-50 text-amber-900 border border-amber-200"
                    : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {feedback.type === "success" && <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />}
            {feedback.type === "warning" && <ShieldAlert size={17} className="text-amber-600 shrink-0" />}
            {feedback.type === "info" && <Info size={17} className="text-blue-600 shrink-0" />}
            {feedback.type === "error" && <AlertCircle size={17} className="text-red-600 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* GRID DE DÍAS */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS_OF_WEEK.map(({ key, label, short }, index) => {
              const isAvailable = daysState[key].isAvailable;
              const isSunday = key === "domingo";

              return (
                <div
                  key={key}
                  onClick={() => toggleDay(key)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 select-none flex flex-col justify-between ${
                    isSunday ? "sm:col-span-2 lg:col-span-1" : ""
                  } ${
                    isLocked
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                  } ${
                    isAvailable
                      ? "bg-white border-slate-200/90 hover:border-slate-300"
                      : "bg-red-50/40 border-red-200 ring-1 ring-red-500/10"
                  }`}
                >
                  {/* HEADER DE TARJETA */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-black tracking-wider transition-colors ${
                            isAvailable
                              ? "bg-slate-100 text-slate-700 group-hover:bg-slate-200/70"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {short}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 leading-none">
                            {label}
                          </h3>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">
                            {isAvailable ? "Jornada regular" : "Día de descanso"}
                          </p>
                        </div>
                      </div>

                      {/* PILL / BADGE TACTIL */}
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? "bg-emerald-500" : "bg-red-500 animate-pulse"
                          }`}
                        />
                        <span>{isAvailable ? "Disponible" : "Descanso"}</span>
                      </div>
                    </div>
                  </div>

                  {/* INPUT DE OBSERVACIÓN INTEGRADO */}
                  <div className="mt-3 pt-3 border-t border-slate-100/80">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        disabled={isLocked}
                        placeholder={isAvailable ? "Observación opcional..." : "Motivo de descanso..."}
                        value={daysState[key].notes}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleNoteChange(key, e.target.value)}
                        className={`w-full text-xs px-3 py-2 rounded-xl border outline-none transition-all placeholder:text-slate-400 disabled:cursor-not-allowed ${
                          isAvailable
                            ? "bg-slate-50/80 border-slate-200/80 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            : "bg-white border-red-200 text-red-950 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              {isLocked
                ? "Formulario bloqueado o fuera del rango de modificación."
                : isExemptUser
                  ? "Modo exento activo: Puedes configurar tus días de descanso libremente sin restricciones de días consecutivos."
                  : "Se requiere programar entre 1 y 2 días de descanso no consecutivos."}
            </p>

            <button
              type="submit"
              disabled={submitting || isLocked}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-[#FF3131] hover:bg-red-600 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-red-500/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {submitting ? (
                <Loading fullscreen={false} size="sm" />
              ) : isLocked ? (
                <>
                  <Lock size={15} /> Registro Bloqueado
                </>
              ) : (
                <>
                  <Send size={15} /> Guardar Disponibilidad
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}