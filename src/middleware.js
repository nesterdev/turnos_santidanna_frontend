import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // En arquitectura separada, delegamos la lectura de localStorage al cliente.
  return next();
});