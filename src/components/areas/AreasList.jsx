import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import Loading from "../ui/Loading";

export default function AreasList() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAreas();
  }, []);

  async function loadAreas() {
    try {
      const res = await apiFetch(`/areas`);
      if (res?.success) setAreas(res.data || []);
      else setError(res?.message || "No se pudieron cargar las áreas.");
    } catch (err) {
      setError(err?.message || "No se pudieron cargar las áreas.");
    } finally {
      setLoading(false);
    }
  }

  const deleteArea = async (id) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar área",
      message:
        "¿Deseas eliminar esta área de trabajo? Esta acción es irreversible.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/areas/${id}`, { method: "DELETE" });
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error eliminando el área");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 px-2 sm:px-0">
      {/* CONTENEDOR UNIFICADO ESTILO EMPLEADOS / TURNOS */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 p-4 sm:p-7 space-y-6">
        
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Áreas de Trabajo
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Gestión de zonas, prioridades y frecuencias operativas
            </p>
          </div>

          <a
            href="/areas/create"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition self-start sm:self-auto"
          >
            + Nueva Área
          </a>
        </div>

        {/* ESTADO DE CARGA */}
        {loading && <Loading fullscreen={false} text="Cargando áreas…" />}

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && areas.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto border border-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">No hay áreas registradas</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Comienza agregando una nueva área operativa.
              </p>
            </div>
          </div>
        )}

        {/* TABLA PRINCIPAL */}
        {!loading && areas.length > 0 && (
          <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 whitespace-nowrap">ID</th>
                  <th className="pb-3 px-3 whitespace-nowrap">NOMBRE</th>
                  <th className="pb-3 px-3 whitespace-nowrap">DESCRIPCIÓN</th>
                  <th className="pb-3 px-3 whitespace-nowrap">ZONA</th>
                  <th className="pb-3 px-3 whitespace-nowrap">PRIORIDAD</th>
                  <th className="pb-3 px-3 whitespace-nowrap">COMPLEJIDAD</th>
                  <th className="pb-3 px-3 whitespace-nowrap">FRECUENCIA</th>
                  <th className="pb-3 px-3 text-right whitespace-nowrap">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-xs">
                {areas.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-gray-400 font-medium whitespace-nowrap">
                      #{a.id}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-gray-900 whitespace-nowrap">
                      {a.name}
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 max-w-[200px] truncate">
                      {a.description || "—"}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {a.zone ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                          {a.zone}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-gray-700 whitespace-nowrap">
                      {a.priority_level ?? "—"}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-gray-700 whitespace-nowrap">
                      {a.complexity_level ?? "—"}
                    </td>

                    <td className="py-3.5 px-3 capitalize text-gray-600 whitespace-nowrap">
                      {a.frequency_type ? (
                        <span>
                          {a.frequency_type} {a.frequency_value ? `(${a.frequency_value})` : ""}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <ActionButton
                          icon="/eye.svg"
                          alt="Ver"
                          href={`/areas/view?id=${a.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <ActionButton
                          icon="/edit.svg"
                          alt="Editar"
                          href={`/areas/edit?id=${a.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <DeleteButton
                          icon="/delete.svg"
                          alt="Eliminar"
                          onClick={() => deleteArea(a.id)}
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