import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { settingsStore, loadSettings } from "../../lib/stores/settingsStore";
import { fetchAPI } from "../../lib/utils/fetch";

export default function SettingsView() {
  const settings = useStore(settingsStore);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setEnabled(settings.isAvailabilityEnabled);
  }, [settings.isAvailabilityEnabled]);

  const handleToggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    setSaving(true);
    setMessage(null);

    try {
      // Usamos el endpoint PUT que definimos en el backend
      const response = await fetchAPI("/settings", {
        method: "PUT",
        body: JSON.stringify({
          key: "availability_enabled",
          value: String(newValue)
        })
      });

      if (response && response.success) {
        setMessage({ type: "success", text: "¡Configuración actualizada correctamente!" });
        loadSettings(); // Recargamos el store global
      } else {
        throw new Error(response?.message || "Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      setEnabled(!newValue); // Revertir cambio local en caso de fallo
      setMessage({ type: "error", text: "No se pudo guardar la configuración." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-200">
        <h2 className="text-lg font-bold text-white mb-2">Configuración del Sistema</h2>
        <p className="text-xs text-slate-400 mb-6">
          Administra la visibilidad y el comportamiento global de los módulos de la aplicación.
        </p>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold mb-4 ${
            message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800">
          <div>
            <p className="text-sm font-bold text-white">Sección "Mi Disponibilidad"</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Habilita o deshabilita el acceso a la sección de disponibilidad para los colaboradores en su barra lateral.
            </p>
          </div>

          <button
            onClick={handleToggle}
            disabled={saving || settings.loading}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enabled ? "bg-[#FF3131]" : "bg-slate-700"
            } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}