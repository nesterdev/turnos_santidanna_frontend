import Section from "./ui/Section";
import Card from "./ui/Card";

export default function DashboardReplacementsStats({ reemplazos }) {
  if (!reemplazos) return null;

  const total = reemplazos.length;
  const porEstado = reemplazos.reduce((acc, r) => {
    const estado = r.status;
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  return (
    <Section title="Estadísticas de Reemplazos">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total solicitudes">
          <p className="text-3xl font-bold">{total}</p>
        </Card>

        {Object.entries(porEstado).map(([estado, count]) => (
          <Card key={estado} title={estado}>
            <p className="text-3xl font-bold">{count}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
