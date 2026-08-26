import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alert";
import { redirect } from "../../lib/utils/navigation";
import Loading from "../ui/Loading";

export default function EmployeeEditForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [id, setId] = useState(null);

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
    if (!rol) return;

    setError("");
    setSuccess("");
    setSubmitting(true);

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
        showSuccess("Empleado actualizado correctamente", {
          onClose: () => redirect("/employees"),
        });
      } else {
        showError(res?.message || "Error actualizando empleado");
      }
    } catch (err) {
      showError(err?.message || "Error al actualizar empleado");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullscreen={false} text="Cargando información del empleado..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-6"
      >
        {/* HEADER */}
        <div className="border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3131]" />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Editar empleado
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Actualiza la información básica y permisos del empleado.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            {success}
          </div>
        )}

        {/* CAMPOS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nombre completo"
            placeholder="Ej. Carlos Muñoz"
            value={nombre}
            onChange={setNombre}
            required
          />

          <Input
            label="Correo electrónico"
            placeholder="carlos@empresa.com"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Teléfono (Opcional)"
              placeholder="+57 300 123 4567"
              value={telefono}
              onChange={setTelefono}
            />
          </div>
        </div>

        {/* SELECCIÓN DE ROL */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Rol en la empresa <span className="text-[#FF3131]">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <RoleCard
              title="Administrador"
              description="Control total de empleados, turnos y áreas"
              active={rol === "admin"}
              onClick={() => setRol("admin")}
            />
            <RoleCard
              title="Supervisor"
              description="Gestión y monitoreo de turnos asignados"
              active={rol === "supervisor"}
              onClick={() => setRol("supervisor")}
            />
            <RoleCard
              title="Empleado"
              description="Asignación estándar a jornadas y áreas"
              active={rol === "worker"}
              onClick={() => setRol("worker")}
            />
          </div>
        </div>

        {/* TOGGLE ESTADO ACTIVO */}
        <div className="flex items-center justify-between bg-gray-50/70 border border-gray-100 rounded-xl px-4 py-3.5">
          <div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Estado del empleado
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Determina si puede recibir turnos y ser asignado a áreas
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivo(!activo)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              activo ? "bg-[#FF3131]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                activo ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <a
            href="/employees"
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-xl transition"
          >
            Cancelar
          </a>
          <button
            type="submit"
            disabled={!rol || submitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF3131] hover:bg-[#e02b2b] rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-[#FF3131]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131] transition placeholder:text-gray-400"
      />
    </div>
  );
}

function RoleCard({
  title,
  description,
  active,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-150 flex flex-col justify-between ${
        active
          ? "border-[#FF3131] bg-red-50/40 ring-1 ring-[#FF3131]/30 shadow-sm"
          : "border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-bold ${
            active ? "text-[#FF3131]" : "text-gray-900"
          }`}
        >
          {title}
        </span>
        <span
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
            active
              ? "border-[#FF3131] bg-[#FF3131]"
              : "border-gray-300 bg-white"
          }`}
        >
          {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 leading-snug">{description}</p>
    </div>
  );
}