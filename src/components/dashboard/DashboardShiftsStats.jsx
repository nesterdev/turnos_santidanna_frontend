import Section from "./ui/Section";
import Card from "./ui/Card";

export default function DashboardShiftsStats({ schedules }) {
  if (!schedules) return null;

  const total = schedules.length;
  const porTurno = schedules.reduce((acc, s) => {
    const t = s.ScheduleShift?.name ?? "Sin Turno";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <Section title="Estadísticas de Turnos">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total turnos hoy">
          <p className="text-3xl font-bold">{total}</p>
        </Card>

        {Object.entries(porTurno).map(([turno, count]) => (
          <Card key={turno} title={turno}>
            <p className="text-3xl font-bold">{count}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
