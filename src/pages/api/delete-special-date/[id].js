import { apiFetch } from "../../../../lib/utils/fetch.js";

export async function post({ params }) {
  const { id } = params;

  try {
    const response = await apiFetch(`/special-dates/${id}`, {
      method: "DELETE",
    });

    return new Response(
      JSON.stringify({ success: true, data: response }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No se pudo eliminar la fecha especial",
      }),
      { status: 500 }
    );
  }
}
