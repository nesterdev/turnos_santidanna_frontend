import Card from "./ui/Card";

export default function DashboardEmployeesSummary({ employees }) {
  const activos = employees.length; // asumimos que todos los listados están activos
  const roles = {
    admin: employees.filter((e) => e.role === "admin").length,
    supervisor: employees.filter((e) => e.role === "supervisor").length,
    worker: employees.filter((e) => e.role === "worker").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card title="Activos">
        <p className="text-3xl font-bold">{activos}</p>
      </Card>
      <Card title="Admins">
        <p className="text-3xl font-bold">{roles.admin}</p>
      </Card>
      <Card title="Supervisores">
        <p className="text-3xl font-bold">{roles.supervisor}</p>
      </Card>
      <Card title="Trabajadores">
        <p className="text-3xl font-bold">{roles.worker}</p>
      </Card>
    </div>
  );
}
