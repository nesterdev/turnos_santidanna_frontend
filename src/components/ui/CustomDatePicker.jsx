import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";

export default function CustomDatePicker({ value, onChange, label = "FECHA:" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedDate = value ? dayjs(value) : dayjs();
  const [viewDate, setViewDate] = useState(selectedDate);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) setViewDate(dayjs(value));
  }, [value]);

  const startOfMonth = viewDate.startOf("month");
  const daysInMonth = viewDate.daysInMonth();
  const startDayOfWeek = (startOfMonth.day() + 6) % 7;

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handleSelectDay = (day) => {
    const newDate = viewDate.date(day).format("YYYY-MM-DD");
    onChange(newDate);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setViewDate(viewDate.add(offset, "month"));
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto" ref={containerRef}>
      {/* BOTÓN TRIGGER / INPUT VISUAL */}
      <div className="flex items-center justify-between sm:justify-start gap-2">
        {label && (
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {label}
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 sm:flex-none flex items-center justify-between gap-3 bg-gray-50/70 border border-gray-200/80 hover:bg-white hover:border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3.5 py-2 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131]"
        >
          <span>{selectedDate.format("DD/MM/YYYY")}</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* POPOVER POPUP */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 z-50 w-full sm:w-72 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* HEADER DEL CALENDARIO */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-xs font-bold text-gray-900 capitalize">
              {viewDate.format("MMMM YYYY")}
            </span>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* DÍAS DE LA SEMANA */}
          <div className="grid grid-cols-7 text-center mb-1">
            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((day) => (
              <span key={day} className="text-[10px] font-bold text-gray-400 uppercase py-1">
                {day}
              </span>
            ))}
          </div>

          {/* GRID DE DÍAS */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;

              const isSelected =
                selectedDate.date() === day &&
                selectedDate.month() === viewDate.month() &&
                selectedDate.year() === viewDate.year();

              const isToday =
                dayjs().date() === day &&
                dayjs().month() === viewDate.month() &&
                dayjs().year() === viewDate.year();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? "bg-[#FF3131] text-white font-bold shadow-sm"
                      : isToday
                      ? "bg-red-50 text-[#FF3131] font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* PIE DE PÁGINA: HOY */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const today = dayjs().format("YYYY-MM-DD");
                onChange(today);
                setViewDate(dayjs());
                setIsOpen(false);
              }}
              className="text-[11px] font-bold text-[#FF3131] hover:underline"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}