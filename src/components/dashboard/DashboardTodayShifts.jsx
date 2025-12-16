import Section from "./ui/Section";
import Table from "./ui/Table";

export default function DashboardTodayShifts({ schedules }) {
  if (!schedules || schedules.length === 0)
    return (
      <Section title="Turnos de Hoy">
        <p>No hay turnos asignados hoy.</p>
      </Section>
    );

  const rows = schedules.map((s) => ({
    Empleado: s.ScheduleEmployee?.name,
    Turno: s.ScheduleShift?.name,
    Inicio: s.ScheduleShift?.start_time,
    Fin: s.ScheduleShift?.end_time,
  }));

  return (
    <Section title="Turnos de Hoy">
      <Table columns={["Empleado", "Turno", "Inicio", "Fin"]} data={rows} />
    </Section>
  );
}
