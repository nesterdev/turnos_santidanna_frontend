import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import Loading from "../ui/Loading";

export default function ReplacementsList() {
  const [replacements, setReplacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await apiFetch("/replacements");
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setReplacements(list);
    } catch {
      setError("No se pudo cargar la lista de reemplazos.");
    } finally {
      setLoading(false);
    }
  }

  const deleteReplacement = async (id) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar reemplazo",
      message:
        "¿Deseas eliminar este registro de reemplazo? Esta acción es irreversible.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/replacements/delete-replacement/${id}`, {
        method: "DELETE",
      });
      setReplacements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error eliminando el reemplazo");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 px-0 sm:px-2">
      {/* CONTENEDOR UNIFICADO ESTILO ÁREAS / DISPONIBILIDAD */}
      <div className="bg-transparent sm:bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-0 sm:border sm:border-gray-100/80 p-4 sm:p-7 space-y-6">
        
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Reemplazos
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Historial y asignación de sustituciones de turnos
            </p>
          </div>

          <a
            href="/replacements/create"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition self-stretch sm:self-auto whitespace-nowrap text-center"
          >
            + Nuevo reemplazo
          </a>
        </div>

        {/* ESTADO DE CARGA */}
        {loading && <Loading fullscreen={false} text="Cargando reemplazos…" />}

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && replacements.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto border border-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">No hay reemplazos registrados</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Comienza registrando una nueva sustitución de personal.
              </p>
            </div>
          </div>
        )}

        {/* TABLA PRINCIPAL */}
        {!loading && replacements.length > 0 && (
          <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 whitespace-nowrap">COLABORADOR TITULAR</th>
                  <th className="pb-3 px-3 whitespace-nowrap">REEMPLAZADO POR</th>
                  <th className="pb-3 px-3 whitespace-nowrap">FECHA</th>
                  <th className="pb-3 px-3 whitespace-nowrap">TURNO DETALLE</th>
                  <th className="pb-3 px-3 text-right whitespace-nowrap">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-xs">
                {replacements.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-gray-900 whitespace-nowrap">
                      {r.ReplacementEmployee?.name || "—"}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-gray-700 whitespace-nowrap">
                      {r.ReplacementReplacer?.name || "—"}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-gray-500 whitespace-nowrap">
                      {r.date || "—"}
                    </td>

                    <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">
                      {r.ReplacementSchedule ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-700 font-mono">
                            Turno #{r.ReplacementSchedule.shift_id}
                          </span>
                          {r.ReplacementSchedule.ScheduleEmployee?.name && (
                            <span className="text-gray-400 text-[11px]">
                              ({r.ReplacementSchedule.ScheduleEmployee.name})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <ActionButton
                          icon="/eye.svg"
                          alt="Ver"
                          href={`/replacements/view?id=${r.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <ActionButton
                          icon="/edit.svg"
                          alt="Editar"
                          href={`/replacements/edit?id=${r.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <DeleteButton
                          icon="/delete.svg"
                          alt="Eliminar"
                          onClick={() => deleteReplacement(r.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}