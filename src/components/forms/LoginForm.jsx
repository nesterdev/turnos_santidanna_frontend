import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { loginApi } from "../../lib/api/auth";
import { saveToken } from "../../lib/utils/auth";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await loginApi(email, password);

    if (!res.token) {
      setError(res.message || "Credenciales incorrectas");
      return;
    }
    saveToken(res.token);
    window.location.href = "/dashboard";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>
      )}

      <Input label="Correo electrónico" value={email} onChange={setEmail} />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
      />

      <Button text="Ingresar" type="submit" />

      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta?{" "}
        <a href="/auth/register" className="text-[#FF3131] underline">
          Crear una
        </a>
      </p>
    </form>
  );
}
