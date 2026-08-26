import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import Loading from "../ui/Loading";

const GROUP_LABELS = {
  day: "Día",
  week: "Semana",
  month: "Mes",
  year: "Año"
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs">
        <p className="font-bold text-gray-200 mb-1">{data.fullName}</p>
        <p className="text-[#FF3131] font-semibold">
          Días trabajados: <span className="text-white font-black">{data.total_days}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function StatsOverview({ dateRange, groupBy }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!dateRange?.from || !dateRange?.to) return;
      setLoading(true);

      const res = await apiFetch(
        `/employees/stats?group_by=${groupBy}&from_date=${dateRange.from}&to_date=${dateRange.to}`
      );

      if (res?.success) {
        setSummary(
          res.data.map((e) => {
            const firstName = e.name ? e.name.trim().split(" ")[0] : "";
            const lastName = e.name ? e.name.trim().split(" ")[1] || "" : "";
            return {
              fullName: e.name,
              shortName: `${firstName} ${lastName}`.trim(),
              total_days: e.total_days,
            };
          })
        );
      }
      setLoading(false);
    }

    load();
  }, [dateRange, groupBy]);

  if (loading) return <Loading fullscreen text="Cargando resumen…" />;

  const minWidth = summary.length > 8 ? summary.length * 60 : "100%";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Días trabajados</h2>
          <p className="text-[11px] text-gray-400 font-medium">
            Agrupado por: <span className="font-semibold text-gray-700">{GROUP_LABELS[groupBy] || groupBy}</span>
          </p>
        </div>
        <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-50 text-[#FF3131] border border-red-100 uppercase tracking-wider">
          {dateRange.from} / {dateRange.to}
        </span>
      </div>

      {summary.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-xs font-semibold text-gray-400">No hay información gráfica para este rango</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div style={{ minWidth }} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary} margin={{ top: 10, right: 10, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar
                  dataKey="total_days"
                  fill="#FF3131"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}