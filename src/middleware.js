import { defineMiddleware } from "astro/middleware";
import jwt from "jsonwebtoken";

const ADMIN_ROUTES = [
  "/dashboard",
  "/employees",
  "/shifts",
  "/availability",
  "/schedules",
  "/replacements",
  "/seasons",
  "/special-dates",
  "/settings",
  "/stats",
  "/areas",
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // 🟢 Rutas públicas
  if (
    pathname === "/" ||
    pathname === "/horario" ||
    pathname === "/unauthorized" || // 👈 CLAVE
    pathname.startsWith("/auth") ||
    pathname.startsWith("/public")
  ) {
    return next();
  }

  const isAdminRoute = ADMIN_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isAdminRoute) return next();

  const token = context.cookies.get("token")?.value;

  // ❌ NO logueado → página bonita
  if (!token) {
    return context.redirect("/unauthorized");
  }

  try {
    const payload = jwt.verify(token, import.meta.env.JWT_SECRET);

    // ❌ Logueado pero NO admin → página bonita
    if (payload.role !== "admin") {
      return context.redirect("/unauthorized");
    }

    // ✅ Admin válido
    return next();
  } catch {
    // ❌ Token inválido → página bonita
    return context.redirect("/unauthorized");
  }
});
