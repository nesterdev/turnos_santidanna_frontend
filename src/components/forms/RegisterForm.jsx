import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { registerApi } from "../../lib/api/auth";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await registerApi(form);

    if (res.message === "Email ya registrado") {
      setError(res.message);
      return;
    }

    if (res.user) {
      setSuccess("Usuario creado correctamente");
      setTimeout(() => (window.location.href = "/auth/login"), 1200);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-600 p-2 rounded mb-4">
          {success}
        </div>
      )}

      <Input label="Nombre" value={form.name} onChange={(v) => update("name", v)} />
      <Input label="Correo" value={form.email} onChange={(v) => update("email", v)} />
      <Input
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={(v) => update("password", v)}
      />

      <div className="mb-4">
        <label className="block font-semibold mb-1">Rol</label>
        <select
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        >
          <option value="worker">Worker</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button text="Crear cuenta" type="submit" />

      <p className="mt-4 text-sm text-center">
        ¿Ya tienes cuenta?{" "}
        <a href="/auth/login" className="text-[#FF3131] underline">
          Inicia sesión
        </a>
      </p>
    </form>
  );
}
