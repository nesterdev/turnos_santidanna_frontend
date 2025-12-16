// src/components/employees/EmployeeView.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import DeleteButton from "../ui/deleteButtom";
import ActionButton from "../ui/ActionButtom";

export default function ShiftsView({ id }) {
  const [turno, setTurno] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const deleteShifts = async (id) => {
    const confirmed = await openConfirmModal({
      title: "Eliminar Turno",
      message: "¿Deseas eliminar este turno? Esta acción es irreversible.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/shifts/${id}`, { method: "DELETE" });
      window.location.href = "/shifts";
    } catch (err) {
      alert("Error eliminando el turno");
    }
  };
  useEffect(() => {
    async function loadEmpleado() {
      try {
        const res = await apiFetch(`/shifts/${id}`);
        console.log("respuesta de shifts view:", res);

        if (res?.success) {
          setTurno(res.data); // <-- asignamos solo los datos
        } else {
          setError(res?.message || "No se pudo cargar el empleado");
        }
      } catch (err) {
        setError(err?.message || "No se pudo cargar el empleado");
      } finally {
        setLoading(false);
      }
    }

    loadEmpleado();
  }, [id]);

  if (loading)
    return (
      <p className="text-gray-700 bg-gray-100 p-3 rounded-lg">
        Cargando información del turno...
      </p>
    );

  if (error)
    return (
      <p className="text-red-600 bg-red-100 p-3 rounded-lg font-medium">
        {error}
      </p>
    );

  if (!turno)
    return (
      <p className="text-gray-700 bg-yellow-100 p-3 rounded-lg font-medium">
        No se encontró el turno
      </p>
    );

  return (
    <div className="bg-white p-6 border rounded-xl shadow space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{turno.name}</h2>

      <div className="space-y-2">
        <p>
          <strong>Hora de Ingreso:</strong> {turno.start_time ?? "No especificado"}
        </p>
        <p>
          <strong>Hora de Salida:</strong> {turno.end_time ?? "No especificado"}
        </p>
        <p>
          <strong>Creado el:</strong>{" "}
          {new Date(turno.created_at).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href={`/shifts`}
          className="bg-blue-100 text-[#FF3131] hover:bg-blue-200"
        />
        <ActionButton
          icon="/edit.svg"
          alt="Editar"
          href={`/shifts/edit/${id}`}
          className="bg-blue-100 text-[#FF3131] hover:bg-blue-200"
        />
        <DeleteButton
          icon="/delete.svg"
          alt="Eliminar"
          onClick={() => deleteShifts(id)}
          className="bg-red-100 text-red-600 hover:bg-red-200"
        />
      </div>
    </div>
  );
}
