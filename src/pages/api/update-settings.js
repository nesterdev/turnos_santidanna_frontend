// /src/pages/api/update-settings.js
import { apiFetch } from "../../../lib/utils/fetch.js";

export async function POST({ request }) {
  try {
    const body = await request.json();

    // Enviar actualización al backend real
    const result = await apiFetch("/settings", {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No se pudieron actualizar las configuraciones.",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
