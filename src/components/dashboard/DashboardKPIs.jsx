export default function DashboardKPIs({ resumen = {} }) {
  const cards = [
    {
      title: "Colaboradores Totales",
      value: resumen.empleados ?? 0,
      badge: "Registrados",
      color: "border-l-4 border-l-blue-500",
      bgIcon: "bg-blue-50 text-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Turnos del Día",
      value: resumen.turnosHoy ?? 0,
      badge: "Hoy",
      color: "border-l-4 border-l-amber-500",
      bgIcon: "bg-amber-50 text-amber-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Reemplazos Pendientes",
      value: resumen.reemplazosPendientes ?? 0,
      badge: resumen.reemplazosPendientes > 0 ? "Requiere atención" : "Al día",
      color: resumen.reemplazosPendientes > 0 ? "border-l-4 border-l-[#FF3131]" : "border-l-4 border-l-emerald-500",
      bgIcon: resumen.reemplazosPendientes > 0 ? "bg-red-50 text-[#FF3131]" : "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, i) => (
        <div key={i} className={`bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between ${card.color}`}>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{card.title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900">{card.value}</span>
              <span className="text-[10px] font-medium text-gray-400">{card.badge}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${card.bgIcon}`}>{card.icon}</div>
        </div>
      ))}
    </div>
  );
}