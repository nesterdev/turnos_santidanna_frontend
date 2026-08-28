// src/components/employees/EmployeeForm.jsx
import { useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { showError, showSuccess } from "../../lib/utils/alerts";
import { redirect } from "../../lib/utils/navigation";
import Field from "../ui/Field";
import Input from "../ui/Input";

export default function EmployeeForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper reutilizable para limpiar errores al escribir/seleccionar
  const updateField = (field, setter) => (val) => {
    setter(val);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!nombre.trim()) errs.nombre = "Completa este campo";
    if (!email.trim()) errs.email = "Completa este campo";
    if (!rol) errs.rol = "Debes seleccionar un rol";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

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
        showSuccess("Empleado creado correctamente", {
          onClose: () => redirect("/employees"),
        });
      } else {
        showError(res?.message || "Error creando empleado");
      }
    } catch (err) {
      showError(err?.message || "Error al crear empleado");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full py-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 space-y-8 shadow-xl shadow-gray-200/40"
      >
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Crear nuevo colaborador
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Agrega un colaborador para asignarle turnos y áreas de trabajo.
          </p>
        </div>

        {/* INPUTS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Nombre completo" error={errors.nombre}>
            <Input
              value={nombre}
              onChange={updateField("nombre", setNombre)}
              hasError={Boolean(errors.nombre)}
              placeholder="Ej. Carlos Muñoz"
            />
          </Field>

          <Field label="Correo electrónico" error={errors.email}>
            <Input
              type="email"
              value={email}
              onChange={updateField("email", setEmail)}
              hasError={Boolean(errors.email)}
              placeholder="Ej: carlos@empresa.com"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Teléfono" hint="Opcional">
              <Input
                type="tel"
                value={telefono}
                onChange={setTelefono}
                placeholder="Ej: 3134318776"
              />
            </Field>
          </div>
        </div>

        {/* SELECCIÓN DE ROL */}
        <Field label="ROL EN LA EMPRESA *" error={errors.rol}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <RoleCard
              title="Administrador"
              description="Control total de empleados, turnos y áreas"
              active={rol === "admin"}
              onClick={() => updateField("rol", setRol)("admin")}
            />
            <RoleCard
              title="Supervisor"
              description="Gestión y monitoreo de turnos asignados"
              active={rol === "supervisor"}
              onClick={() => updateField("rol", setRol)("supervisor")}
            />
            <RoleCard
              title="Empleado"
              description="Asignación estándar a jornadas y áreas"
              active={rol === "worker"}
              onClick={() => updateField("rol", setRol)("worker")}
            />
          </div>
        </Field>

        {/* ACCIONES */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <a
            href="/employees"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
          >
            Cancelar
          </a>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#FF3131] hover:bg-red-600 active:scale-95 text-white font-semibold text-xs transition shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? "Guardando…" : "Crear empleado"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function RoleCard({ title, description, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
        active
          ? "border-red-500/40 bg-white ring-2 ring-red-500/10 shadow-xs"
          : "border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${active ? "text-gray-900" : "text-gray-800"}`}>
          {title}
        </span>
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            active ? "border-red-500" : "border-gray-300"
          }`}
        >
          {active && <div className="w-2.5 h-2.5 rounded-full bg-[#FF3131]" />}
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}