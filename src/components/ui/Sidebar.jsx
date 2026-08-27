import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { user } from "../../lib/stores/userStore";
import { logout } from "../../lib/utils/auth";

export default function Sidebar() {
  const [active, setActive] = useState("");
  const currentUser = useStore(user);
  const role = currentUser?.role || "worker";

  useEffect(() => {
    const updateActivePath = () => setActive(window.location.pathname);
    updateActivePath();

    // Sincronización con las navegaciones SPA de Astro ClientRouter
    document.addEventListener("astro:page-load", updateActivePath);
    return () => document.removeEventListener("astro:page-load", updateActivePath);
  }, []);

  const icons = {
    dashboard: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    employees: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    shifts: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    schedules: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    areas: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    availability: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    replacements: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    stats: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    home: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  };

  const navigationGroups = {
    super_admin: [
      {
        title: "Principal",
        items: [
          { label: "Dashboard", href: "/dashboard", icon: icons.dashboard },
          { label: "Estadísticas", href: "/stats", icon: icons.stats }
        ]
      },
      {
        title: "Gestión Operativa",
        items: [
          { label: "Empleados", href: "/employees", icon: icons.employees },
          { label: "Turnos", href: "/shifts", icon: icons.shifts },
          { label: "Horarios", href: "/schedules", icon: icons.schedules },
          { label: "Áreas", href: "/areas", icon: icons.areas }
        ]
      },
      {
        title: "Solicitudes",
        items: [
          { label: "Disponibilidad", href: "/availability", icon: icons.availability },
          { label: "Reemplazos", href: "/replacements", icon: icons.replacements }
        ]
      },
      {
        title: "Mi Panel",
        items: [
          { label: "Mi Horario", href: "/mi-horario", icon: icons.schedules },
          { label: "Mi Disponibilidad", href: "/mi-disponibilidad", icon: icons.availability }
        ]
      }
    ],
    admin: [
      {
        title: "Principal",
        items: [
          { label: "Dashboard", href: "/dashboard", icon: icons.dashboard },
          { label: "Estadísticas", href: "/stats", icon: icons.stats }
        ]
      },
      {
        title: "Gestión Operativa",
        items: [
          { label: "Empleados", href: "/employees", icon: icons.employees },
          { label: "Turnos", href: "/shifts", icon: icons.shifts },
          { label: "Horarios", href: "/schedules", icon: icons.schedules },
          { label: "Áreas", href: "/areas", icon: icons.areas }
        ]
      },
      {
        title: "Solicitudes",
        items: [
          { label: "Disponibilidad", href: "/availability", icon: icons.availability },
          { label: "Reemplazos", href: "/replacements", icon: icons.replacements }
        ]
      },
      {
        title: "Mi Panel",
        items: [
          { label: "Mi Horario", href: "/mi-horario", icon: icons.schedules },
          { label: "Mi Disponibilidad", href: "/mi-disponibilidad", icon: icons.availability }
        ]
      }
    ],
    supervisor: [
      {
        title: "Operación",
        items: [
          { label: "Empleados", href: "/employees", icon: icons.employees },
          { label: "Turnos", href: "/shifts", icon: icons.shifts },
          { label: "Horarios", href: "/schedules", icon: icons.schedules },
          { label: "Disponibilidad", href: "/availability", icon: icons.availability }
        ]
      },
      {
        title: "Mi Panel",
        items: [
          { label: "Mi Horario", href: "/mi-horario", icon: icons.schedules },
          { label: "Mi Disponibilidad", href: "/mi-disponibilidad", icon: icons.availability }
        ]
      }
    ],
    worker: [
      {
        title: "Mi Panel",
        items: [
          { label: "Mi Horario", href: "/mi-horario", icon: icons.schedules },
          { label: "Mi Disponibilidad", href: "/mi-disponibilidad", icon: icons.availability }
        ]
      }
    ]
  };

  const currentMenu = navigationGroups[role] || navigationGroups.worker;

  const roleStyles = {
    admin: "bg-red-50 text-[#FF3131] border-red-200",
    supervisor: "bg-amber-50 text-amber-700 border-amber-200",
    worker: "bg-blue-50 text-blue-700 border-blue-200"
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800 select-none">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-[#FF3131] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20">
            GT
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-base tracking-tight leading-none">TurnosPro</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Enterprise UI</span>
          </div>
        </div>

        <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {currentMenu.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = active === item.href || (item.href !== "/" && active.startsWith(item.href));
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                        isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-[#FF3131] rounded-xl shadow-md shadow-red-600/30"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className={`relative z-10 ${isActive ? "text-white" : "text-slate-400"}`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Acceso Directo</p>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-white transition-all"
            >
              {icons.home}
              Ir al Inicio
            </a>
          </div>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {currentUser && (
          <a
            href="/profile"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-[#FF3131] group-hover:text-white transition-colors">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 truncate leading-tight group-hover:text-white">
                  {currentUser.name}
                </p>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border mt-0.5 ${roleStyles[role] || roleStyles.worker}`}>
                  {role}
                </span>
              </div>
            </div>
          </a>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-600/90 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}