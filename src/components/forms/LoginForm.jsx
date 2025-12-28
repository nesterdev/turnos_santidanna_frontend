import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { loginApi } from "../../lib/api/auth";
import { saveToken } from "../../lib/utils/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    // FIX iOS: a veces viene undefined desde onClick
    if (e?.preventDefault) e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await loginApi(email, password);

      if (!res || !res.token) {
        setError(res?.message || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      saveToken(res.token);

      // FIX iOS Safari redirect
      window.location.assign("/dashboard");
    } catch (err) {
      setError("Error de conexión");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        p-6
        rounded-lg
        shadow-lg
        w-full
        max-w-md
        mx-auto
      "
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Iniciar sesión
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={setEmail}
        autoCapitalize="none"
        autoCorrect="off"
        inputMode="email"
      />

      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
        autoCapitalize="none"
      />

      <Button
        text={loading ? "Ingresando..." : "Ingresar"}
        type="submit"
        onClick={handleSubmit} // FIX iOS
        disabled={loading}
      />

      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta?{" "}
        <a
          href="/auth/register"
          className="text-[#FF3131] underline"
        >
          Crear una
        </a>
      </p>
    </form>
  );
}
