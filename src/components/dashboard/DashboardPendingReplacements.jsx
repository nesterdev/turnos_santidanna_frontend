import Section from "./ui/Section";
import Table from "./ui/Table";

export default function DashboardPendingReplacements({ reemplazos }) {
  if (!reemplazos || reemplazos.length === 0)
    return (
      <Section title="Reemplazos Pendientes">
        <p>No hay reemplazos en espera.</p>
      </Section>
    );

  const rows = reemplazos.map((r) => ({
    Turno: r.ReplacementSchedule?.ScheduleShift?.name,
    Empleado: r.ReplacementSchedule?.ScheduleEmployee?.name,
    Estado: r.status,
  }));

  return (
    <Section title="Reemplazos Pendientes">
      <Table columns={["Turno", "Empleado", "Estado"]} data={rows} />
    </Section>
  );
}
