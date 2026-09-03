import { useState } from "react";
import Input from "../ui/Input";
import Field from "../ui/Field";
import Button from "../ui/Button";
import AnimatedMascot from "../ui/AnimatedMascot";
import { loginApi } from "../../lib/api/auth";
import { saveToken } from "../../lib/utils/auth";
import { setUser } from "../../lib/stores/userStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isFocusEmail, setIsFocusEmail] = useState(false);
  const [isFocusPassword, setIsFocusPassword] = useState(false);

  const playAudio = (soundName) => {
    try {
      const audio = new Audio(`/sounds/${soundName}.wav`);
      audio.volume = 0.4;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  async function handleSubmit(e) {
    if (e?.preventDefault) e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await loginApi(email, password);

      playAudio("success");
      setSuccess(true);

      saveToken(res.token);

      if (res.user) {
        setUser(res.user);
        localStorage.setItem("app_user", JSON.stringify(res.user));
      }

      const redirectPath = res.user?.role === "admin" ? "/dashboard" : "/mi-horario";
      setTimeout(() => {
        window.location.assign(redirectPath);
      }, 1200);
    } catch (err) {
      // 🔥 Aquí capturamos el mensaje exacto que viene del backend a través de apiFetch
      setError(err.message || "Error de conexión con el servidor");
      playAudio("error");
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Resplandor de fondo */}
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100/80 transition-all duration-300">

        {/* Mascota Animada Interactiva */}
        <AnimatedMascot
          email={email}
          password={password}
          emailLength={email.length}
          passLength={password.length}
          isFocusEmail={isFocusEmail}
          isFocusPassword={isFocusPassword}
          showPassword={showPassword}
          isError={Boolean(error)}
          isSuccess={success}
          isLoading={loading}
        />

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            ¡Hola de nuevo!
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Mensaje de Error Global */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-600 border border-red-200/60 p-3.5 rounded-2xl mb-5 text-sm font-medium animate-shake">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Correo Electrónico usando Field */}
          <Field label="Correo electrónico">
            <Input
              placeholder="tcncarlos392@gmail.com"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                if (error) setError("");
              }}
              onFocus={() => {
                setIsFocusEmail(true);
                setIsFocusPassword(false);
              }}
              onBlur={() => setIsFocusEmail(false)}
              disabled={loading}
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
            />
          </Field>

          {/* Contraseña usando Field */}
          <Field label="Contraseña">
            <div className="relative">
              <Input
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  if (error) setError("");
                }}
                onFocus={() => {
                  setIsFocusPassword(true);
                  setIsFocusEmail(false);
                }}
                onBlur={() => setIsFocusPassword(false)}
                disabled={loading}
                autoCapitalize="none"
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition focus:outline-none p-1"
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </Field>

          {/* Botón de Enviar */}
          <div className="pt-2">
            {/* Botón de Enviar */}
            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Validando...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-gray-500 font-medium">
            ¿No tienes una cuenta?{" "}
            <a
              href="/auth/register"
              className="text-[#FF3131] font-bold underline hover:text-red-700 transition-colors"
            >
              Crear una
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}