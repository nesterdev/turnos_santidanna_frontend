import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";

export default function ScheduleForm() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mode, setMode] = useState("automatic");

  const [autoData, setAutoData] = useState({
    capacity: 1,
    start_date: "",
    end_date: "",
    shift_id: null,
  });

  const [manualData, setManualData] = useState({
    employee_id: null,
    shift_id: null,
    date: "",
    area_ids: [],
  });

  useEffect(() => {
    async function load() {
      try {
        const [e, s, a] = await Promise.all([
          apiFetch("/employees"),
          apiFetch("/shifts"),
          apiFetch("/areas"),
        ]);
        if (e?.success) setEmployees(e.data);
        if (s?.success) setShifts(s.data);
        if (a?.success) setAreas(a.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "automatic") {
        const res = await apiFetch("/schedules/generate", {
          method: "POST",
          body: JSON.stringify({
            start_date: autoData.start_date,
            end_date: autoData.end_date || autoData.start_date,
            capacity_default: Number(autoData.capacity),
            shift_id: autoData.shift_id,
          }),
        });

        if (res?.success) setSuccess("Horarios generados correctamente.");
        else setError(res?.message);
      } else {
        const res = await apiFetch("/schedules", {
          method: "POST",
          body: JSON.stringify({
            employee_id: manualData.employee_id,
            shift_id: manualData.shift_id,
            date: manualData.date,
            area_ids: manualData.area_ids,
          }),
        });

        if (res?.success) setSuccess("Horario creado correctamente.");
        else setError(res?.message);
      }
    } catch {
      setError("Error inesperado.");
    }
  };

  if (loading) return <p className="text-gray-500">Cargando…</p>;

  return (
    <form
      onSubmit={submit}
      className="max-w-4xl mx-auto bg-white rounded-2xl  p-10 space-y-10 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Asignación de horarios
        </h2>
        <p className="text-sm text-gray-500">
          Configura asignación automática o manual
        </p>
      </div>

      {/* MODE */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        {["automatic", "manual"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              mode === m
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            {m === "automatic" ? "Automático" : "Manual"}
          </button>
        ))}
      </div>

      {/* AUTOMATIC */}
      {mode === "automatic" && (
        <>
          {/* NUMBER INPUT */}
          <div>
            <label className="label">Cantidad de empleados</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setAutoData((p) => ({
                    ...p,
                    capacity: Math.max(1, p.capacity - 1),
                  }))
                }
                className="px-3 py-2 rounded-xl border"
              >
                −
              </button>
              <input
                type="number"
                value={autoData.capacity}
                onChange={(e) =>
                  setAutoData({ ...autoData, capacity: e.target.value })
                }
                className="input text-center w-24"
              />
              <button
                type="button"
                onClick={() =>
                  setAutoData((p) => ({
                    ...p,
                    capacity: p.capacity + 1,
                  }))
                }
                className="px-3 py-2 rounded-xl border"
              >
                +
              </button>
            </div>
          </div>

          {/* DATES */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha inicio</label>
              <input
                type="date"
                className="input"
                onChange={(e) =>
                  setAutoData({ ...autoData, start_date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Fecha fin</label>
              <input
                type="date"
                className="input"
                onChange={(e) =>
                  setAutoData({ ...autoData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* SHIFTS CARDS */}
          <div className="space-y-2">
            <label className="label">Turno</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {shifts.map((s) => (
                <div
                  key={s.id}
                  onClick={() =>
                    setAutoData({ ...autoData, shift_id: s.id })
                  }
                  className={`card-option ${
                    autoData.shift_id === s.id
                      ? "card-option-active"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.start_time} – {s.end_time}
                    </p>
                  </div>
                  <input
                    type="radio"
                    checked={autoData.shift_id === s.id}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MANUAL */}
      {mode === "manual" && (
        <>
          {/* EMPLOYEES */}
          <div className="space-y-2">
            <label className="label">Empleado</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {employees.map((e) => (
                <div
                  key={e.id}
                  onClick={() =>
                    setManualData({ ...manualData, employee_id: e.id })
                  }
                  className={`card-option ${
                    manualData.employee_id === e.id
                      ? "card-option-active"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-xs text-gray-500">{e.role}</p>
                  </div>
                  <input
                    type="radio"
                    checked={manualData.employee_id === e.id}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AREAS CHECKBOX */}
          <div>
            <label className="label">Áreas</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {areas.map((a) => (
                <label
                  key={a.id}
                  className="card-option items-center gap-3"
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={(e) =>
                      setManualData((p) => ({
                        ...p,
                        area_ids: e.target.checked
                          ? [...p.area_ids, a.id]
                          : p.area_ids.filter((id) => id !== a.id),
                      }))
                    }
                  />
                  <span className="text-sm">{a.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* DATE */}
          <div>
            <label className="label">Fecha</label>
            <input
              type="date"
              className="input"
              onChange={(e) =>
                setManualData({ ...manualData, date: e.target.value })
              }
            />
          </div>
        </>
      )}

      {/* ACTION */}
      <div className="flex justify-end border-t pt-6">
        <button className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600">
          {mode === "automatic" ? "Generar horarios" : "Crear horario"}
        </button>
      </div>
    </form>
  );
}
