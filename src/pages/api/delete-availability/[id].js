import { apiFetch } from "../../../../lib/utils/fetch.js";

export async function post({ params }) {
  const { id } = params;

  try {
    await apiFetch(`/availability/${id}`, { method: "DELETE" });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
