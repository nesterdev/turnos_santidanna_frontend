// src/components/settings/SettingsView.jsx
import React from "react";
import SettingsList from "./SettingsList";
import PushBroadcastCard from "./PushBroadcastCard";
import PushDevicesList from "../ui/PushDevicesList";

export default function SettingsView() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Configuraciones del Sistema</h1>
        <p className="text-sm text-gray-500">Administra los parámetros globales de la aplicación.</p>
      </div>
      <SettingsList />
      <PushBroadcastCard />
      <PushDevicesList />
    </div>
  );
}