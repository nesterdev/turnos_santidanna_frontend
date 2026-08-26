import { useEffect, useState } from "react";

export default function DashboardButton() {
  const [destination, setDestination] = useState("/auth/login");
  const [buttonText, setButtonText] = useState("Iniciar Sesión");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("app_user");

    if (token && rawUser) {
      try {
        const user = JSON.parse(rawUser);
        setButtonText("Mi Panel");

        // Redirección condicional según el rol
        if (user.role === "admin") {
          setDestination("/dashboard");
        } else if (user.role === "worker") {
          setDestination("/mi-horario"); // O "/mi-disponibilidad"
        } else {
          setDestination("/dashboard");
        }
      } catch (e) {
        setDestination("/auth/login");
      }
    }
  }, []);

  return (
    <a
      href={destination}
      className="bg-[#FF3131] hover:bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center"
    >
      {buttonText}
    </a>
  );
}