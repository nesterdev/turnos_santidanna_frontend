import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import ActionButton from "../ui/ActionButtom";
import DeleteButton from "../ui/deleteButtom";
import { openConfirmModal } from "../../lib/utils/modal";
import CreateButton from "../ui/CreateButton";

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

  /* ───────────────────────── STATES ───────────────────────── */

  if (loading)
    return (
      <div className="p-6 rounded-2xl bg-white/70 border border-gray-100 shadow-sm text-gray-500">
        Cargando turnos…
      </div>
    );

  if (error)
    return (
      <div className="p-6 rounded-2xl bg-red-50/70 border border-red-100 text-red-700">
        {error}
      </div>
    );

  /* ───────────────────────── VIEW ───────────────────────── */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-end px-6 pt-6 pb-4">
        <CreateButton
          href="/shifts/create"
          label="Nuevo turno"
        />
      </div>

      {/* EMPTY */}
      {!shifts.length && (
        <div className="p-10 rounded-2xl bg-gray-50/60 border border-gray-100 text-center text-gray-500">
          No hay turnos registrados
        </div>
      )}

      {/* TABLE */}
      {!!shifts.length && (
        <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50/70 text-gray-500 border-b">
                <tr>
                  <th className="p-4 text-left font-medium">ID</th>
                  <th className="p-4 text-left font-medium">Nombre</th>
                  <th className="p-4 text-left font-medium">Inicio</th>
                  <th className="p-4 text-left font-medium">Fin</th>
                  <th className="p-4 text-left font-medium">Notas</th>
                  <th className="p-4 text-left font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {shifts.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b last:border-none hover:bg-gray-50/60 transition"
                  >
                    <td className="p-4 text-gray-400">
                      #{s.id}
                    </td>

                    <td className="p-4 font-medium text-gray-900">
                      {s.name}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                        {s.start_time}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                        {s.end_time}
                      </span>
                    </td>

                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {s.notes || "—"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon="/eye.svg"
                          alt="Ver"
                          href={`/shifts/view?id=${s.id}`}
                          className="bg-gray-100 hover:bg-gray-200"
                        />

                        <ActionButton
                          icon="/edit.svg"
                          alt="Editar"
                          href={`/shifts/edit?id=${s.id}`}
                          className="bg-gray-100 hover:bg-gray-200"
                        />

                        <DeleteButton
                          icon="/delete.svg"
                          alt="Eliminar"
                          onClick={() => deleteShift(s.id)}
                          className="bg-gray-100 hover:bg-gray-200"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE HINT */}
          <div className="md:hidden text-xs text-gray-400 px-4 py-2 border-t">
            Desliza horizontalmente para ver más →
          </div>
        </div>
      )}
    </div>
  );
}
