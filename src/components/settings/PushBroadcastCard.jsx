import React, { useState } from "react";
import { sendBroadcastNotification } from "../../lib/api/push";
import { showAlert } from "../../lib/utils/alerts";
// Ajusta la importación de alertas según la estructura de tu proyecto (ej. alert.js o alerts.js)

export default function PushBroadcastCard() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      showAlert("El cuerpo del mensaje es obligatorio", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await sendBroadcastNotification({
        title: title.trim() || undefined,
        body: body.trim(),
      });
      
      showAlert(res.message || "Notificación masiva enviada con éxito", "success");
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Error al enviar broadcast:", error);
      showAlert(error.message || "Error al enviar la notificación masiva", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Enviar Notificación Push Masiva</h2>
        <p className="text-xs text-gray-500">
          Envía un aviso a todos los dispositivos registrados en la PWA. El backend personalizará el saludo automáticamente usando el nombre de cada empleado.
        </p>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Título (Opcional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. ¡Aviso importante de gerencia!"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <span className="text-[11px] text-gray-400 mt-1 block">
            Si se deja vacío, por defecto iniciará con &quot;¡Hola, [Nombre]! 👋&quot;
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Mensaje / Cuerpo <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Escribe aquí el contenido del comunicado para el personal..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar a Toda la PWA"}
          </button>
        </div>
      </form>
    </div>
  );
}