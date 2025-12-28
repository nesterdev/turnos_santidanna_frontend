import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import DeleteButton from "../ui/deleteButtom";
import ListContainer from "../layouts/ListContainer";
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
        : Array.isArray(response.data)
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
    console.log("id de reemplazo", id);
    const confirmed = await openConfirmModal({
      title: "Eliminar reemplazo",
      message:
        "¿Deseas eliminar este registro de reemplazo? Esta acción es irreversible.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      const res = await apiFetch(`/replacements/delete-replacement/${id}`, {
        method: "DELETE",
      });
      setReplacements((prev) => prev.filter((a) => a.id !== id));
      console.log("respuesta delete replacements", res);
    } catch {
      alert("Error eliminando el reemplazo");
    }
  };

  if (loading)
    return (
      <Loading fullscreen text="Cargando reemplazos…" />
    );

  if (error)
    return (
      <div className="max-w-6xl mx-auto p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <ListContainer
        title="Reemplazos"
        description="Gestión de reemplazos de empleados"
        createHref="/replacements/create"
        createLabel="Nuevo reemplazo"
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-medium">Empleado</th>
              <th className="px-6 py-3 font-medium">Reemplazado por</th>
              <th className="px-6 py-3 font-medium">Fecha</th>
              <th className="px-6 py-3 font-medium">Turno</th>
              <th className="px-6 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {replacements.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No hay reemplazos registrados
                </td>
              </tr>
            )}

            {replacements.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-50 hover:bg-gray-50/60 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {r.ReplacementEmployee?.name || "—"}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {r.ReplacementReplacer?.name || "—"}
                </td>

                <td className="px-6 py-4 text-gray-600">{r.date}</td>

                <td className="px-6 py-4 text-gray-600">
                  {r.ReplacementSchedule ? (
                    <div className="space-y-0.5">
                      <div>Turno #{r.ReplacementSchedule.shift_id}</div>
                      <div className="text-xs text-gray-500">
                        {r.ReplacementSchedule.ScheduleEmployee?.name}
                      </div>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-6 py-4 flex justify-end gap-2">
                  <ActionButton
                    icon="/eye.svg"
                    alt="Ver"
                    href={`/replacements/view?id=${r.id}`}
                    className="bg-transparent hover:bg-gray-100 text-gray-600"
                  />

                  <ActionButton
                    icon="/edit.svg"
                    alt="Editar"
                    href={`/replacements/edit?id=${r.id}`}
                    className="bg-transparent hover:bg-gray-100 text-gray-600"
                  />

                  <DeleteButton
                    icon="/delete.svg"
                    alt="Eliminar"
                    onClick={() => deleteReplacement(r.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
