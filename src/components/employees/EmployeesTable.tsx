import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import CreateButton from "../ui/CreateButton";

interface Empleado {
  id: number;
  name: string;
  email: string;
  role: "worker" | "supervisor" | "admin";
  active: boolean;
}

export default function EmployeesTable() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteEmployee = async (id: number) => {
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
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-end px-6 pt-6 pb-4">
        <CreateButton
          href="/employees/create"
          label="Nuevo empleado"
        />
      </div>

      {/* ESTADOS */}
      {loading && (
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500 animate-pulse">
          Cargando empleados…
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TABLA */}
      {!loading && !error && (
        <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="p-4 text-left font-medium">Nombre</th>
                  <th className="p-4 text-left font-medium">Email</th>
                  <th className="p-4 text-left font-medium">Estado</th>
                  <th className="p-4 text-left font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {empleados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-gray-500"
                    >
                      No hay empleados registrados
                    </td>
                  </tr>
                ) : (
                  empleados.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b last:border-none hover:bg-gray-50/60 transition"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {emp.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {emp.email}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${
                            emp.active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {emp.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ActionButton
                            icon="/eye.svg"
                            alt="Ver"
                            href={`/employees/view?id=${emp.id}`}
                            className="bg-gray-100 hover:bg-gray-200"
                          />

                          <ActionButton
                            icon="/edit.svg"
                            alt="Editar"
                            href={`/employees/edit?id=${emp.id}`}
                            className="bg-gray-100 hover:bg-gray-200"
                          />

                          <DeleteButton
                            icon="/delete.svg"
                            alt="Eliminar"
                            onClick={() => deleteEmployee(emp.id)}
                            className="bg-red-50 hover:bg-red-100"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE HINT */}
          <div className="md:hidden px-4 py-2 text-xs text-gray-400 border-t">
            Desliza horizontalmente para ver más →
          </div>
        </div>
      )}
    </div>
  );
}
