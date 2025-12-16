import { apiFetch } from "../../../../lib/utils/fetch.js";

export async function DELETE({ params }) {
  const { id } = params;

  try {
    const result = await apiFetch(`/schedules/${id}`, {
      method: "DELETE",
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "No se pudo eliminar el horario.",
      }),
      { status: 500 }
    );
  }
}
