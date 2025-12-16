import { apiFetch } from "../../../../lib/utils/fetch.js";

export async function POST({ params }) {
  const { id } = params;

  try {
    await apiFetch(`/seasons/${id}`, {
      method: "DELETE",
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "No se pudo eliminar la temporada." }),
      { status: 500 }
    );
  }
}
