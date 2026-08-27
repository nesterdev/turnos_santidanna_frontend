import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar.jsx";

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.toggleDrawer = () => setOpen((prev) => !prev);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 h-full"
            onClick={(e) => {
              if (e.target.closest("a")) {
                setOpen(false);
              }
            }}
          >
            <Sidebar />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}