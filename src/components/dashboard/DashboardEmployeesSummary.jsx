import Card from "./ui/Card";

export default function DashboardEmployeesSummary({ employees }) {
  console.log("lo recibido en sumarydash", employees);

  const activos = employees.total;

  const rolesMap = employees.roles.reduce((acc, r) => {
    acc[r.role] = Number(r.count);
    return acc;
  }, {});

  const admins = rolesMap.admin ?? 0;
  const supervisors = rolesMap.supervisor ?? 0;
  const workers = rolesMap.worker ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card title="Activos">
        <p className="text-3xl font-bold">{activos}</p>
      </Card>

      <Card title="Admins">
        <p className="text-3xl font-bold">{admins}</p>
      </Card>

      <Card title="Supervisores">
        <p className="text-3xl font-bold">{supervisors}</p>
      </Card>

      <Card title="Trabajadores">
        <p className="text-3xl font-bold">{workers}</p>
      </Card>
    </div>
  );
}
