import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false);

  // Exponer toggle global para Topbar
  useEffect(() => {
    window.toggleDrawer = () => setOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden flex transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Overlay */}
      {open && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Contenido drawer */}
      <div className="relative w-64 h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-y-auto rounded-r-xl p-6">
        <Sidebar client:load />
      </div>
    </div>
  );
}
