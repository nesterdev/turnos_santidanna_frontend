import { useState, useEffect } from "react";
import { Smartphone, Trash2, RefreshCw, ShieldAlert } from "lucide-react";
import { getPushSubscriptions, deletePushSubscription } from "../../lib/api/push";
import { showSuccess, showError } from "../../lib/utils/alerts"; // <--- Importamos las funciones correctas

export default function PushDevicesList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await getPushSubscriptions();
      console.log("Dispositivos obtenidos:", res);
      setSubscriptions(res.subscriptions || []);
    } catch (error) {
      console.error("Error al cargar dispositivos:", error);
      showError("No se pudieron cargar los dispositivos registrados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de desvincular este dispositivo? Dejará de recibir notificaciones.")) {
      return;
    }

    try {
      await deletePushSubscription(id);
      showSuccess("Dispositivo eliminado con éxito"); // <--- Orden correcto mediante helper
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Error al eliminar suscripción:", error);
      showError(error.message || "Error al eliminar el dispositivo");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Dispositivos y Llaves Registradas</h2>
          <p className="text-xs text-gray-500">
            Lista de navegadores y móviles vinculados al sistema para recibir notificaciones push.
          </p>
        </div>
        <button
          onClick={fetchSubscriptions}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
          title="Actualizar lista"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Cargando dispositivos...</div>
      ) : subscriptions.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ShieldAlert className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-600">No hay dispositivos registrados todavía.</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Los usuarios deben aceptar las notificaciones desde su PWA.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] uppercase text-gray-400 font-semibold">
                <th className="py-3 px-3">Colaborador</th>
                <th className="py-3 px-3">Endpoint / Navegador</th>
                <th className="py-3 px-3">Fecha de Registro</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
              {subscriptions.map((sub) => {
                let browserName = "Desconocido";
                try {
                  const urlObj = new URL(sub.endpoint);
                  browserName = urlObj.hostname;
                } catch {
                  browserName = "Endpoint personalizado";
                }

                return (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">
                        {sub.Employee ? sub.Employee.name : "Usuario Anónimo"}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {sub.Employee ? sub.Employee.email : `ID: ${sub.employeeId}`}
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate">
                      <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                        <Smartphone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate" title={sub.endpoint}>{browserName}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 truncate block">
                        ID Registro: {sub.id}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                        title="Eliminar / Revocar dispositivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}