// src/components/ui/Sidebar.jsx
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(window.location.pathname);
  }, []);

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Empleados", href: "/employees" },
    { label: "Turnos", href: "/shifts" },
    { label: "Horarios", href: "/schedules" },
    { label: "Areas", href: "/areas" },
    { label: "Disponibilidad", href: "/availability" },
    { label: "Reemplazos", href: "/replacements" },
    { label: "Estadísticas", href: "/stats" },
    { label: "Temporadas", href: "/seasons" },
    { label: "Fechas Especiales", href: "/special-dates" },
    { label: "Ajustes", href: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-white/90 backdrop-blur-xl shadow-md flex flex-col p-6 border-r border-gray-100">
      {/* Título */}
      <h1 className="text-2xl font-extrabold text-[#FF3131] mb-8 tracking-tight">
        Gestión de Turnos
      </h1>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        {links.map((item) => {
          const isActive = active.startsWith(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`
                px-4 py-2 rounded-lg font-medium transition
                flex items-center
                ${isActive
                  ? "bg-[#FF3131] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#FF3131]"}
              `}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/auth/login";
          }}
          className="
            w-full
            px-4 py-2
            bg-[#FF3131] text-white
            rounded-lg
            font-medium
            hover:bg-[#e02a2a]
            shadow-sm
            transition
          "
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
