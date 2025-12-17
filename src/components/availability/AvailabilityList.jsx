import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import CreateButton from "../ui/CreateButton";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";

const daysMap = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export default function AvailabilityList() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await apiFetch("/availability");
      console.log("disponibilidad", res)
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setAvailability(list);
    } catch {
      setError("No se pudo cargar la disponibilidad.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAvailability(id) {
    const confirmed = await openConfirmModal({
      title: "Eliminar disponibilidad",
      message: "Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    await apiFetch(`/availability/${id}`, { method: "DELETE" });
    loadData();
  }

  if (loading)
    return (
      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl max-w-xl">
        Cargando disponibilidad…
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl">{error}</p>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Disponibilidad
          </h2>
          <p className="text-sm text-gray-500">
            Días disponibles por empleado
          </p>
        </div>

        <CreateButton
          href="/availability/create"
          label="Nueva disponibilidad"
        />
      </div>

      {/* TABLE */}
      <div className="relative overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-b">
              {["Empleado", "Día", "Estado", "Notas", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs uppercase tracking-wide text-gray-400 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {availability.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-6 text-center text-gray-500"
                >
                  No hay registros de disponibilidad
                </td>
              </tr>
            )}

            {availability.map((a) => (
              <tr
                key={a.id}
                className="border-b last:border-0 hover:bg-gray-50/60 transition"
              >
                <td className="px-5 py-3 font-medium text-gray-900">
                  {a.AvailabilityEmployee?.name || "Empleado desconocido"}
                </td>

                <td className="px-5 py-3 text-gray-600">
                  {daysMap[a.day_of_week]}
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${
                        a.available
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                  >
                    {a.available ? "Disponible" : "No disponible"}
                  </span>
                </td>

                <td className="px-5 py-3 text-gray-500 max-w-[280px] truncate">
                  {a.notes || "—"}
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      icon="/eye.svg"
                      alt="Ver"
                      href={`/availability/view/${a.id}`}
                    />

                    <ActionButton
                      icon="/edit.svg"
                      alt="Editar"
                      href={`/availability/edit/${a.id}`}
                    />

                    <DeleteButton
                      icon="/delete.svg"
                      alt="Eliminar"
                      onClick={() => deleteAvailability(a.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE HINT */}
      <div className="md:hidden text-xs text-gray-400 px-5 py-3 border-t">
        Desliza horizontalmente para ver más →
      </div>
    </div>
  );
}
