import api from "../../../lib/utils/fetch.js";

export async function DELETE({ params }) {
  try {
    await api(`/shifts/${params.id}`, "DELETE");
    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
