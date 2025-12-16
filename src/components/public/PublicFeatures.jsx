export default function PublicFeatures() {
  const items = [
    { title: "Horarios", desc: "Consulta turnos diarios y futuros" },
    { title: "Descansos", desc: "Días libres claramente marcados" },
    { title: "Áreas", desc: "Asignación de áreas por turno" },
    { title: "Fechas", desc: "Navega entre diferentes días" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((i) => (
        <div key={i.title} className="bg-white border rounded-xl p-5 shadow-sm">
          <h4 className="font-semibold text-gray-900">{i.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{i.desc}</p>
        </div>
      ))}
    </section>
  );
}
