import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { registerApi } from "../../lib/api/auth";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "worker", // Envió fijo internamente
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Reproducir efectos de sonido nativos usando la carpeta public/sounds/
  const playAudio = (soundName) => {
    try {
      const audio = new Audio(`/sounds/${soundName}.wav`);
      audio.volume = 0.4;
      audio.play().catch(() => { });
    } catch (e) {
      // Si el navegador bloquea autoplay o no encuentra el audio, continua suavemente
    }
  };

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  }

  // Comprobaciones de validación dinámica
  const isNameValid = form.name.trim().split(/\s+/).filter(Boolean).length >= 2;
  // 1. Expresión regular ajustada para gmail, hotmail y outlook (.com o .es)
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.(com|es)$/i.test(form.email.trim());

  function validateForm() {
    if (!isNameValid) {
      setError("Ingresa tu nombre completo (mínimo nombre y apellido)");
      playAudio("error");
      return false;
    }

    if (!isEmailValid) {
      // 2. Mensaje de error actualizado
      setError("El correo debe pertenecer a @gmail, @hotmail o @outlook (.com o .es)");
      playAudio("error");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await registerApi({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      });

      if (!res || res.message === "Email ya registrado" || res.error) {
        setError(res?.message || res?.error || "Error al registrar el usuario");
        playAudio("error");
        setLoading(false);
        return;
      }

      playAudio("success");
      setSuccess("¡Cuenta creada con éxito! Redirigiendo...");
      setTimeout(() => (window.location.href = "/auth/login"), 1400);
    } catch (err) {
      setError("Error de conexión con el servidor");
      playAudio("error");
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100/80 transition-all duration-300">

        {/* Encabezado con punto pulsante */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF3131]"></span>
            </span>
            <h2 className="text-2xl font-black tracking-tight text-gray-900">
              Crear nuevo usuario
            </h2>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Completa tus datos para ingresar a la plataforma.
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-600 border border-red-200/60 p-3.5 rounded-2xl mb-5 text-sm font-medium animate-shake">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Mensaje de Éxito */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-200/60 p-3.5 rounded-2xl mb-5 text-sm font-medium animate-bounce-short">
            <svg className="w-5 h-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                NOMBRE COMPLETO <span className="text-red-500">*</span>
              </label>
              {form.name && (
                <span className={`text-[11px] font-semibold transition-colors ${isNameValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isNameValid ? "✓ Válido" : "Ingresa nombre y apellido"}
                </span>
              )}
            </div>
            <Input
              placeholder="Ej. Carlos Muñoz"
              value={form.name}
              onChange={(v) => update("name", v)}
              disabled={loading}
            />
          </div>

          {/* Campo Correo */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                CORREO ELECTRÓNICO <span className="text-red-500">*</span>
              </label>
              {form.email && (
                <span className={`text-[11px] font-semibold transition-colors ${isEmailValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isEmailValid ? "✓ Dominio permitido" : "@gmail, @hotmail o @outlook (.com/.es)"}
                </span>
              )}
            </div>
            <Input
              placeholder="tcncarlos392@gmail.com"
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              disabled={loading}
            />
          </div>

          {/* Botón de Enviar */}
          <div className="pt-3">
            <Button
              text={
                loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  "Crear cuenta"
                )
              }
              type="submit"
              disabled={loading}
            />
          </div>

          {/* Footer del Formulario */}
          <p className="mt-6 text-sm text-center text-gray-500 font-medium">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/auth/login"
              className="text-[#FF3131] font-bold underline hover:text-red-700 transition-colors"
            >
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}