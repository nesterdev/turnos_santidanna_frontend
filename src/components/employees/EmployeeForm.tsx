import { useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function EmployeeForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<"admin" | "worker" | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch("/employees", {
        method: "POST",
        body: JSON.stringify({
          name: nombre,
          email,
          phone: telefono,
          role: rol,
        }),
      });

      if (res?.success) {
        setSuccess("Empleado creado correctamente.");
        setTimeout(() => (window.location.href = "/employees"), 800);
      } else {
        setError(res?.message || "Error creando empleado");
      }
    } catch (err: any) {
      setError(err?.message || "Error al crear empleado");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl
                 shadow-sm border border-gray-100 p-8 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Crear nuevo empleado
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Agrega un empleado para asignarle turnos y áreas.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <Input
          label="Nombre completo"
          value={nombre}
          onChange={setNombre}
          required
        />

        {/* Email */}
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />

        {/* Teléfono */}
        <Input
          label="Teléfono"
          value={telefono}
          onChange={setTelefono}
        />
      </div>

      {/* ROL (cards modernas) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Rol del empleado
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RoleCard
            title="Administrador"
            description="Gestiona empleados, áreas y turnos"
            active={rol === "admin"}
            onClick={() => setRol("admin")}
          />
          <RoleCard
            title="Empleado"
            description="Puede ser asignado a turnos y áreas"
            active={rol === "worker"}
            onClick={() => setRol("worker")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <a
          href="/employees"
          className="px-5 py-2.5 text-sm rounded-xl border border-gray-200
                     text-gray-700 hover:bg-gray-50 transition"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={!rol}
          className="px-5 py-2.5 text-sm rounded-xl bg-black text-white
                     hover:bg-gray-900 transition shadow-sm disabled:opacity-50"
        >
          Crear empleado
        </button>
      </div>
    </form>
  );
}

/* ================= UI HELPERS ================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/10 transition"
      />
    </div>
  );
}

function RoleCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-4 transition
        ${
          active
            ? "border-black bg-black/5"
            : "border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          checked={active}
          readOnly
          className="mt-1 h-4 w-4 text-black border-gray-300"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
