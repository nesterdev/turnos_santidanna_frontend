import { useState, useRef, useEffect } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

export function CustomTimePicker({ hour, minute, onHourChange, onMinuteChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer clic fuera del control
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Botón trigger principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50/50 border border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl px-4 py-3 text-xs font-mono font-bold transition focus:outline-none focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131]"
      >
        <div className="flex items-center gap-1 text-sm">
          <span>{hour}</span>
          <span className="text-gray-400 font-sans">:</span>
          <span>{minute}</span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Popover desplegable flotante */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="grid grid-cols-2 gap-3">
            {/* Columna Horas */}
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400 mb-2 text-center tracking-wider">
                Hora
              </span>
              <div className="h-44 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
                {HOURS.map((h) => (
                  <button
                    key={`h-${h}`}
                    type="button"
                    onClick={() => onHourChange(h)}
                    className={`w-full text-center py-1.5 rounded-lg text-xs font-mono transition ${
                      hour === h
                        ? "bg-[#FF3131] text-white font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {h}:00
                  </button>
                ))}
              </div>
            </div>

            {/* Columna Minutos */}
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400 mb-2 text-center tracking-wider">
                Minutos
              </span>
              <div className="h-44 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
                {MINUTES.map((m) => (
                  <button
                    key={`m-${m}`}
                    type="button"
                    onClick={() => {
                      onMinuteChange(m);
                      setIsOpen(false); // Cierra automáticamente al seleccionar minuto
                    }}
                    className={`w-full text-center py-1.5 rounded-lg text-xs font-mono transition ${
                      minute === m
                        ? "bg-[#FF3131] text-white font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    :{m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}