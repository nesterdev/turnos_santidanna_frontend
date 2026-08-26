// src/components/ui/SidebarDrawer.jsx
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.toggleDrawer = () => setOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden flex transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop en blanco/negro suave con blur */}
      <div
        className={`absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer desplegable */}
      <div
        className={`relative z-10 h-full transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => {
          if (e.target.closest("a")) {
            setOpen(false);
          }
        }}
      >
        <Sidebar />
      </div>
    </div>
  );
}