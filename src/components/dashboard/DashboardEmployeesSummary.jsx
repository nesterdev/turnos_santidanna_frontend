export default function DashboardEmployeesSummary({ employees }) {
  const activos = employees?.total ?? 0;

  const rolesMap = (employees?.roles || []).reduce((acc, r) => {
    acc[r.role] = Number(r.count);
    return acc;
  }, {});

  const items = [
    { label: "Activos", val: activos, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
    { label: "Admins", val: rolesMap.admin ?? 0, color: "text-indigo-700 bg-indigo-50 border-indigo-100" },
    { label: "Supervisores", val: rolesMap.supervisor ?? 0, color: "text-amber-700 bg-amber-50 border-amber-100" },
    { label: "Trabajadores", val: rolesMap.worker ?? 0, color: "text-blue-700 bg-blue-50 border-blue-100" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF3131]"></span>
        Resumen de Personal
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className={`p-3 rounded-lg border ${item.color} flex flex-col justify-between`}>
            <span className="text-[11px] font-medium opacity-80">{item.label}</span>
            <span className="text-xl font-bold mt-1">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}