import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { openConfirmModal } from "../../lib/utils/modal";
import DeleteButton from "../ui/deleteButtom";
import ActionButton from "../ui/ActionButtom";
import Loading from "../ui/Loading";

export default function EmployeeView() {
  const [id, setId] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const deleteEmployee = async () => {
    const confirmed = await openConfirmModal({
      title: "Eliminar empleado",
      message: "Esta acción es permanente y no se puede deshacer.",
      confirmText: "Eliminar",
    });

    if (!confirmed) return;

    try {
      await apiFetch(`/employees/${id}`, { method: "DELETE" });
      window.location.href = "/employees";
    } catch {
      alert("Error eliminando el empleado");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    if (!empId) {
      setError("ID de empleado inválido");
      setLoading(false);
      return;
    }

    setId(empId);
  }, []);

  useEffect(() => {
    if (!id) return;
    async function loadEmpleado() {
      try {
        const res = await apiFetch(`/employees/${id}`);
        if (res?.success) setEmpleado(res.data);
        else setError(res?.message || "No se pudo cargar el empleado");
      } catch (err) {
        setError(err?.message || "No se pudo cargar el empleado");
      } finally {
        setLoading(false);
      }
    }

    loadEmpleado();
  }, [id]);

  if (loading) return <Loading fullscreen={false} text="Cargando información..." />;

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
        {error}
      </div>
    );

  if (!empleado) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-8 py-7 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {empleado.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Información del empleado
          </p>
        </div>

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            empleado.active
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {empleado.active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-sm">
        <InfoItem label="Email" value={empleado.email} />
        <InfoItem label="Teléfono" value={empleado.phone} />
        <InfoItem label="Rol" value={empleado.role} capitalize />
        <InfoItem
          label="Creado el"
          value={new Date(empleado.created_at).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <ActionButton
          icon="/left.svg"
          alt="Volver"
          href="/employees"
          className="bg-gray-50 text-gray-600 hover:bg-gray-100"
        />

        <div className="flex gap-3">
          <ActionButton
            icon="/edit.svg"
            alt="Editar"
            href={`/employees/edit?id=${id}`}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
          />

          <DeleteButton
            icon="/delete.svg"
            alt="Eliminar"
            onClick={deleteEmployee}
            className="bg-red-50 text-red-600 hover:bg-red-100"
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, capitalize }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
        {label}
      </p>
      <p
        className={`text-gray-900 font-medium ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}