import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import CreateButton from "../ui/CreateButton";
import { openConfirmModal } from "../../lib/utils/modal";
import Loading from "../ui/Loading";

const ROLE_LABELS = {
  admin: { label: "Admin", class: "bg-purple-50 text-purple-700 border-purple-200" },
  supervisor: { label: "Supervisor", class: "bg-blue-50 text-blue-700 border-blue-200" },
  worker: { label: "Empleado", class: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function EmployeesTable() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteEmployee = async (id) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar empleado",
      message: "¿Deseas eliminar este empleado? Esta acción es irreversible.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/employees/${id}`, { method: "DELETE" });
      setEmpleados((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Error eliminando el empleado");
    }
  };

  useEffect(() => {
    async function loadEmpleados() {
      try {
        const res = await apiFetch("/employees");
        if (res?.success) setEmpleados(res.data);
        else setError("No se pudo cargar la lista de empleados");
      } catch {
        setError("Error cargando empleados");
      } finally {
        setLoading(false);
      }
    }
    loadEmpleados();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-0 sm:px-2">
      {/* TARJETA UNIFICADA */}
      <div className="bg-transparent sm:bg-white/80 sm:backdrop-blur-xl sm:border sm:border-gray-100 sm:rounded-2xl sm:shadow-sm overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Colaboradores</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Gestión y control de acceso del personal
            </p>
          </div>
          <CreateButton href="/employees/create" label="Nuevo empleado" />
        </div>

        {/* ESTADO DE ERROR */}
        {error && (
          <div className="m-4 sm:m-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* ESTADO DE CARGA */}
        {loading && <Loading fullscreen={false} text="Cargando empleados…" />}

        {/* TABLA DE EMPLEADOS */}
        {!loading && !error && (
          <div className="relative overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Empleado</th>
                  <th className="px-6 py-3.5">Rol</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {empleados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      No hay empleados registrados actualmente.
                    </td>
                  </tr>
                ) : (
                  empleados.map((emp) => {
                    const roleConfig = ROLE_LABELS[emp.role] || ROLE_LABELS.worker;
                    const initial = emp.name ? emp.name.charAt(0).toUpperCase() : "E";

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Nombre & Email con Avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-red-50 text-[#FF3131] border border-red-100 flex items-center justify-center font-bold text-sm shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {emp.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {emp.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Rol */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${roleConfig.class}`}
                          >
                            {roleConfig.label}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-gray-100 text-gray-500 border border-gray-200/60"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                emp.active ? "bg-emerald-500" : "bg-gray-400"
                              }`}
                            />
                            {emp.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <ActionButton
                              icon="/eye.svg"
                              alt="Ver"
                              href={`/employees/view?id=${emp.id}`}
                              className="bg-gray-50 hover:bg-gray-100 border border-gray-200/60"
                            />
                            <ActionButton
                              icon="/edit.svg"
                              alt="Editar"
                              href={`/employees/edit?id=${emp.id}`}
                              className="bg-gray-50 hover:bg-gray-100 border border-gray-200/60"
                            />
                            <DeleteButton
                              icon="/delete.svg"
                              alt="Eliminar"
                              onClick={() => deleteEmployee(emp.id)}
                              className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PIE MOVIL */}
        <div className="md:hidden px-4 py-2 text-xs text-gray-400 border-t border-gray-100 bg-gray-50/50">
          Desliza horizontalmente para ver más →
        </div>
      </div>
    </div>
  );
}