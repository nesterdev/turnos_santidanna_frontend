import { api } from "../../../../lib/utils/api.js";

export async function POST({ params }) {
  const { id } = params;

  try {
    const response = await api(`/replacements/${id}`, {
      method: "DELETE",
    });

    return new Response(
      JSON.stringify({ success: true, message: "Reemplazo eliminado correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar reemplazo:", error);

    return new Response(
      JSON.stringify({ success: false, error: "No se pudo eliminar el reemplazo" }),
      { status: 500 }
    );
  }
}
