import { useState, useEffect, useRef } from "react";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("app_user");
    if (stored) setUser(JSON.parse(stored));

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="w-full flex justify-between items-center">
      {/* Botón hamburguesa móvil */}
      <button
        className="md:hidden p-3 rounded-lg hover:bg-gray-200 transition transform active:scale-95"
        onClick={() => window.toggleDrawer?.()}
      >
        <svg
          className="w-7 h-7 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Nombre de usuario */}
      <h2 className="text-xl font-semibold text-gray-700 hidden md:block">
        Bienvenido, <span className="text-[#FF3131]">{user.name}</span>
      </h2>

      {/* Menu perfil */}
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-10 h-10 bg-[#FF3131] text-white rounded-full flex items-center justify-center font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {menuOpen && (
            <div className="absolute right-30 mt-0 w-44 bg-white shadow-xl rounded-lg p-2 origin-top-right animate-dropdown">
              <button
                className="w-full text-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("app_user");
                  window.location.href = "/auth/login";
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
          <span className="font-medium capitalize">{user.role}</span>
        </button>
      </div>
    </div>
  );
}
