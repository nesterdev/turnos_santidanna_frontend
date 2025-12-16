import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiFetch } from "../../lib/utils/fetch";

export default function SchedulePublicView() {
  const [schedules, setSchedules] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const daysPerPage = 5;

  useEffect(() => {
    loadSchedules();
  }, [startDate]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/schedules/public?start=${startDate}&days=${daysPerPage}`);
      if (res?.success) setSchedules(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prevDays = () => {
    setStartDate(dayjs(startDate).subtract(daysPerPage, "day").format("YYYY-MM-DD"));
  };
  const nextDays = () => {
    setStartDate(dayjs(startDate).add(daysPerPage, "day").format("YYYY-MM-DD"));
  };

  const groupedByDate = schedules.reduce((acc, s) => {
    (acc[s.date] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <button onClick={prevDays} className="px-3 py-1 bg-gray-200 rounded">← Anteriores</button>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button onClick={nextDays} className="px-3 py-1 bg-gray-200 rounded">Siguientes →</button>
      </div>

      {loading && <p>Cargando horarios…</p>}

      {!loading && Object.keys(groupedByDate).length === 0 && <p>No hay horarios para estas fechas.</p>}

      {!loading && Object.entries(groupedByDate).map(([date, daySchedules]) => (
        <div key={date} className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">{dayjs(date).format("dddd, DD MMM YYYY")}</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Empleado</th>
                <th className="p-2 text-left">Turno</th>
                <th className="p-2 text-left">Áreas</th>
              </tr>
            </thead>
            <tbody>
              {daySchedules.map(s => (
                <tr key={s.id} className="border-b last:border-none">
                  <td className="p-2">{s.ScheduleEmployee?.name}</td>
                  <td className="p-2">{s.is_rest_day ? "Descanso" : s.ScheduleShift?.name}</td>
                  <td className="p-2">{s.areas.map(a => a.name).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
