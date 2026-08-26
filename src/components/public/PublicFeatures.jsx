import { Calendar, Coffee, Layers, Clock } from "lucide-react";

export default function PublicFeatures() {
  const items = [
    {
      title: "Horarios Diarios",
      desc: "Consulta la programación operativa de turnos diarios y semanas futuras.",
      icon: Calendar,
    },
    {
      title: "Control de Descansos",
      desc: "Visualiza de forma clara los días libres asignados a cada empleado.",
      icon: Coffee,
    },
    {
      title: "Áreas Operativas",
      desc: "Identifica rápidamente las zonas de trabajo asignadas por cada turno.",
      icon: Layers,
    },
    {
      title: "Navegación Ágil",
      desc: "Explora la información navegando fácilmente entre diferentes fechas.",
      icon: Clock,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-gray-200/80 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center mb-3 group-hover:bg-red-50 group-hover:text-[#FF3131] transition-colors">
              <Icon size={18} />
            </div>
            <h4 className="text-xs font-bold text-gray-900 tracking-tight">
              {item.title}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}