// /src/middleware/auth.js
import { defineMiddleware } from "astro/middleware";

const PROTECTED_PATHS = [
  "/dashboard",
  "/employees",
  "/shifts",
  "/availability",
  "/schedules",
  "/replacements",
  "/seasons",
  "/special-dates",
  "/settings",
];

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // Rutas públicas
  if (pathname.startsWith("/auth")) {
    return next();
  }

  // Determinar si la ruta es protegida
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (!isProtected) return next();

  // Verificar token (del lado del servidor)
  const token = context.cookies.get("token")?.value;

  if (!token) {
    return context.redirect("/auth/login");
  }

  return next();
});
