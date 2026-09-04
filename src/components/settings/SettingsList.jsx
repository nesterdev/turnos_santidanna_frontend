// src/components/settings/SettingsList.jsx
import React, { useEffect, useState } from "react";
import { settingsApi } from "../../lib/api/settings";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Loading from "../ui/Loading";
import { showSuccess, showError } from "../../lib/utils/alerts";

export default function SettingsList() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [savingKey, setSavingKey] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getAll();
      if (res?.success) {
        setSettings(res.data);
      }
    } catch (error) {
      showError("Error al cargar las configuraciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleSetting = async (key, currentValue) => {
    const nextValue = currentValue === "true" ? "false" : "true";
    setSavingKey(key);
    try {
      const res = await settingsApi.update({ key, value: nextValue });
      if (res?.success) {
        showSuccess("Configuración actualizada correctamente");
        fetchSettings();
      } else {
        showError(res?.message || "No se pudo actualizar la configuración");
      }
    } catch (error) {
      showError(error?.message || "Error al actualizar la configuración");
    } finally {
      setSavingKey(null);
    }
  };

  const handleCreateSetting = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || newValue.trim() === "") {
      return showError("La clave y el valor son obligatorios");
    }

    try {
      const res = await settingsApi.create({ key: newKey.trim(), value: newValue });
      if (res?.success) {
        showSuccess("Configuración creada correctamente");
        setNewKey("");
        setNewValue("");
        fetchSettings();
      } else {
        showError(res?.message || "Error al crear la configuración");
      }
    } catch (error) {
      showError(error?.message || "Error al crear la configuración");
    }
  };

  if (loading) return <Loading fullscreen={false} text="Cargando configuraciones..." />;

  const availabilitySetting = settings.find((s) => s.key === "availability_enabled");
  const isAvailable = availabilitySetting ? availabilitySetting.value === "true" : true;
  const otherSettings = settings.filter((s) => s.key !== "availability_enabled");

  return (
    <div className="w-full py-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* CONTROL DE DISPONIBILIDAD (ESTILO DE TARJETA MODERNA) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Disponibilidad de Usuarios</h2>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  isAvailable ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {isAvailable ? "Habilitado" : "Deshabilitado"}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Controla de forma global el módulo de envío de disponibilidad para los usuarios regulares.
            </p>
          </div>

          <button
            type="button"
            disabled={savingKey === "availability_enabled"}
            onClick={() => handleToggleSetting("availability_enabled", isAvailable ? "true" : "false")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-xs transition active:scale-95 shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
              isAvailable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-gray-100"
                : "bg-[#FF3131] hover:bg-red-600 text-white shadow-red-500/20"
            }`}
          >
            {savingKey === "availability_enabled" && (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {isAvailable ? "Deshabilitar Módulo" : "Habilitar Módulo"}
          </button>
        </div>

        {/* GRID INFERIOR: CONFIGURACIONES Y NUEVA LLAVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LISTADO DE OTRAS CONFIGURACIONES */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/40 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">
                Parámetros del Sistema
              </h3>
              <p className="text-sm text-gray-400 mb-6">Variables adicionales almacenadas en base de datos.</p>

              {otherSettings.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                  No hay configuraciones adicionales.
                </div>
              ) : (
                <div className="space-y-3">
                  {otherSettings.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-sm text-gray-800 block">{item.key}</span>
                        <span className="text-[11px] text-gray-400">Actualizado: {new Date(item.updated_at).toLocaleDateString()}</span>
                      </div>
                      <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-mono shadow-2xs">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FORMULARIO NUEVA CONFIGURACIÓN */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/40">
            <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">
              Nueva Configuración
            </h3>
            <p className="text-sm text-gray-400 mb-6">Añade parámetros operativos clave-valor.</p>

            <form onSubmit={handleCreateSetting} className="space-y-5">
              <Field label="Clave (Key)">
                <Input
                  value={newKey}
                  onChange={setNewKey}
                  placeholder="ej. maintenance_mode"
                />
              </Field>

              <Field label="Valor (Value)">
                <Input
                  value={newValue}
                  onChange={setNewValue}
                  placeholder="ej. true"
                />
              </Field>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 active:scale-95 text-white font-semibold text-xs transition shadow-md shadow-red-500/20 cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}