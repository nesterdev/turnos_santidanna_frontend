import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "framer-motion";
import { user } from "../../lib/stores/userStore";
import { logout } from "../../lib/utils/auth";

export default function Topbar() {
  const currentUser = useStore(user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!currentUser) return null;

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Botón menú móvil alineado con la visibilidad de la Sidebar (md:hidden) */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          onClick={() => window.toggleDrawer?.()}
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-none">
            Hola, <span className="text-[#FF3131]">{currentUser.name}</span>
          </h2>
          <p className="hidden sm:block text-[11px] font-medium text-gray-400 mt-1">
            Bienvenido de nuevo a la plataforma
          </p>
        </div>
      </div>

      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-[#FF3131] to-red-500 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs font-bold text-gray-800 leading-none">{currentUser.name}</span>
            <span className="text-[10px] font-semibold text-gray-400 capitalize mt-0.5">{currentUser.role}</span>
          </div>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-gray-100 p-1.5 z-50"
            >
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="text-xs font-bold text-gray-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{currentUser.email || "Usuario Activo"}</p>
              </div>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition font-semibold cursor-pointer"
                onClick={logout}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}