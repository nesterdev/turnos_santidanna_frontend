import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import Loading from "../ui/Loading";

export default function ShiftList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShifts() {
      try {
        const res = await apiFetch("/shifts");
        if (res?.success) setShifts(res.data || []);
        else setError(res?.message || "No se pudieron cargar los turnos.");
      } catch (err) {
        setError(err?.message || "No se pudieron cargar los turnos.");
      } finally {
        setLoading(false);
      }
    }
    loadShifts();
  }, []);

  const deleteShift = async (id) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar turno",
      message:
        "¿Estás seguro de que deseas eliminar este turno? Esta acción es permanente.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/shifts/${id}`, { method: "DELETE" });
      setShifts((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error eliminando el turno");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 p-7 space-y-6">
        
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Gestión de Turnos
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Configura y administra los horarios base para la programación operativa.
            </p>
          </div>

          <a
            href="/shifts/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition self-start sm:self-auto"
          >
            + Nuevo turno
          </a>
        </div>

        {/* ESTADO DE CARGA */}
        {loading && <Loading fullscreen={false} text="Cargando turnos…" />}

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && shifts.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto border border-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">No hay turnos registrados</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Comienza agregando un nuevo turno operacional.
              </p>
            </div>
          </div>
        )}

        {/* TABLA PRINCIPAL */}
        {!loading && shifts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">ID</th>
                  <th className="pb-3 px-3">NOMBRE DEL TURNO</th>
                  <th className="pb-3 px-3">HORA INICIO</th>
                  <th className="pb-3 px-3">HORA FIN</th>
                  <th className="pb-3 px-3">DESCANSO</th>
                  <th className="pb-3 px-3">NOTAS</th>
                  <th className="pb-3 px-3 text-right">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-xs">
                {shifts.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-gray-400 font-medium">
                      #{s.id}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-gray-900">
                      {s.name}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 font-mono">
                        {s.start_time}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 font-mono">
                        {s.end_time}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 font-mono">
                        {s.break_time ? `${s.break_time} min` : "0 min"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 max-w-xs truncate">
                      {s.notes || "—"}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <ActionButton
                          icon="/eye.svg"
                          alt="Ver"
                          href={`/shifts/view?id=${s.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <ActionButton
                          icon="/edit.svg"
                          alt="Editar"
                          href={`/shifts/edit?id=${s.id}`}
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                        />
                        <DeleteButton
                          icon="/delete.svg"
                          alt="Eliminar"
                          onClick={() => deleteShift(s.id)}
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