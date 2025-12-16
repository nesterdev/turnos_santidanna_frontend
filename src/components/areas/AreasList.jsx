import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import CreateButton from "../ui/CreateButton";

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

  /* ---------- STATES ---------- */

  if (loading)
    return (
      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl max-w-xl">
        Cargando áreas…
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl">{error}</p>
    );

  if (!areas.length)
    return (
      <div className="text-center py-12 text-gray-500">
        No hay áreas creadas
      </div>
    );

  /* ---------- TABLE ---------- */

  return (
    <div className="bg-white rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
      {/* HEADER */}
      <div className="flex items-center justify-end px-6 pt-6 pb-4">
        <CreateButton href="/areas/create" label="Nueva Área" />
      </div>
      <div className="relative overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead>
            <tr className="border-b">
              {[
                "ID",
                "Nombre",
                "Descripción",
                "Prioridad",
                "Complejidad",
                "Frecuencia",
                "Cantidad",
                "Zona",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {areas.map((a) => (
              <tr
                key={a.id}
                className="border-b last:border-0 hover:bg-gray-50/60 transition"
              >
                <td className="px-4 py-3 text-gray-500">{a.id}</td>

                <td className="px-4 py-3 font-medium text-gray-900">
                  {a.name}
                </td>

                <td className="px-4 py-3 text-gray-500 max-w-[260px] truncate">
                  {a.description || "—"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {a.priority_level ?? "—"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {a.complexity_level ?? "—"}
                </td>

                <td className="px-4 py-3 capitalize text-gray-600">
                  {a.frequency_type ?? "—"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {a.frequency_value ?? "—"}
                </td>

                <td className="px-4 py-3 text-gray-600">{a.zone ?? "—"}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      icon="/eye.svg"
                      alt="Ver"
                      href={`/areas/view/${a.id}`}
                      className="bg-gray-50 hover:bg-gray-100"
                    />

                    <ActionButton
                      icon="/edit.svg"
                      alt="Editar"
                      href={`/areas/edit/${a.id}`}
                      className="bg-gray-50 hover:bg-gray-100"
                    />

                    <DeleteButton
                      icon="/delete.svg"
                      alt="Eliminar"
                      onClick={() => deleteArea(a.id)}
                      className="bg-gray-50 hover:bg-red-50"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE HINT */}
      <div className="md:hidden text-xs text-gray-400 px-4 py-3 border-t">
        Desliza horizontalmente para ver más →
      </div>
    </div>
  );
}
