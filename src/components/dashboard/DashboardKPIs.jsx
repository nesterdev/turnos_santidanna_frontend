import Card from "./ui/Card";

export default function DashboardKPIs({ resumen }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Empleados">
        <p className="text-4xl font-bold">{resumen.empleados}</p>
      </Card>

      <Card title="Turnos del Día">
        <p className="text-4xl font-bold">{resumen.turnosHoy}</p>
      </Card>

      <Card title="Reemplazos Pendientes">
        <p className={`text-4xl font-bold ${resumen.reemplazosPendientes > 0 ? "text-red-600" : "text-green-600"}`}>
          {resumen.reemplazosPendientes}
        </p>
      </Card>
    </div>
  );
}
