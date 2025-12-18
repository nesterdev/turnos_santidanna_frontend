import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function EmployeeEditForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [id, setId] = useState(null);
  // 👇 LEER QUERY PARAM EN CLIENTE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");

    console.log("id leída desde URL:", empId);

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
        if (res?.success) {
          const data = res.data;
          setNombre(data.name || "");
          setEmail(data.email || "");
          setTelefono(data.phone || "");
          setRol(data.role || "");
          setActivo(data.active ?? true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: nombre,
          email,
          phone: telefono,
          role: rol,
          active: activo,
        }),
      });

      if (res?.success) {
        setSuccess("Empleado actualizado correctamente.");
        setTimeout(() => (window.location.href = "/employees"), 800);
      } else {
        setError(res?.message || "Error actualizando empleado");
      }
    } catch (err) {
      setError(err?.message || "Error al actualizar empleado");
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto bg-white/70 backdrop-blur p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-600">
        Cargando empleado…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl
                 shadow-sm border border-gray-100 p-8 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Editar empleado
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza la información básica del empleado.
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Nombre completo" value={nombre} onChange={setNombre} />
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Input label="Teléfono" value={telefono} onChange={setTelefono} />
      </div>

      {/* ROL (cards premium) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Rol del empleado
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <RoleCard
            title="Administrador"
            description="Acceso total al sistema"
            active={rol === "admin"}
            onClick={() => setRol("admin")}
          />
          <RoleCard
            title="Empleado"
            description="Asignable a turnos y áreas"
            active={rol === "worker"}
            onClick={() => setRol("worker")}
          />
          <RoleCard
            title="Supervisor"
            description="Coordina y valida operaciones"
            active={rol === "supervisor"}
            onClick={() => setRol("supervisor")}
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-800">Empleado activo</p>
          <p className="text-xs text-gray-500">
            Permite asignarle turnos y áreas
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActivo(!activo)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            activo ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              activo ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
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
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

/* ================= UI HELPERS ================= */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/10 transition"
      />
    </div>
  );
}

function RoleCard({ title, description, active, onClick }) {
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
