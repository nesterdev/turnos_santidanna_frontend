import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
          res.data.map((e) => ({
            name: e.name,
            total_days: e.total_days,
          }))
        );
      }
      setLoading(false);
    }

    load();
  }, [dateRange, groupBy]);

  if (loading)
    return (
      <div className="p-6 bg-white border rounded-xl shadow-sm text-gray-600">
        Cargando resumen…
      </div>
    );

  return (
    <div className="p-6 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Días trabajados
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={summary}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="total_days"
            fill="#111827"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
