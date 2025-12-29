import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { redirect } from "../../lib/utils/navigation";
import { showError, showSuccess } from "../../lib/utils/alert";
import { canSelectArea } from "../../lib/rules/scheduleAreas";
import { apiAction } from "../../lib/utils/apiAction";
import { useScheduleFormData } from "../../hooks/useScheduleFormData";
import { hideLoading, showLoading } from "../../lib/utils/loading";
import Loading from "../ui/Loading";

export default function ScheduleForm() {
  const { employees, shifts, areas, loading } = useScheduleFormData();

  const [manualAreas, setManualAreas] = useState([]);
  const [manualEmployees, setManualEmployees] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
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
    if (mode !== "manual" || !manualData.date) {
      setManualAreas([]);
      setManualEmployees([]);
      return;
    }

    async function loadContext() {
      setLoadingAreas(true);
      try {
        const res = await apiFetch(
          `/schedules/manual-context?date=${manualData.date}${
            manualData.employee_id
              ? `&employee_id=${manualData.employee_id}`
              : ""
          }`
        );

        if (res?.success) {
          setManualEmployees(res.employees);
          setManualAreas(res.areas || []);
          setManualData((p) => ({ ...p, area_ids: [] }));
        }
      } finally {
        setLoadingAreas(false);
      }
    }

    loadContext();
  }, [mode, manualData.date, manualData.employee_id]);

  const submit = async (e) => {
    e.preventDefault();
    showLoading("Guardando horario…");
    try {
      if (mode === "automatic") {
        await apiAction(
          apiFetch("/schedules/generate", {
            method: "POST",
            body: JSON.stringify({
              start_date: autoData.start_date,
              end_date: autoData.end_date || autoData.start_date,
              capacity_default: Number(autoData.capacity),
              shift_id: autoData.shift_id,
            }),
          }),
          "Horarios generados correctamente",
          () => redirect("/schedules")
        );
      } else {
        await apiAction(
          apiFetch("/schedules", {
            method: "POST",
            body: JSON.stringify({
              employee_id: manualData.employee_id,
              shift_id: manualData.shift_id,
              date: manualData.date,
              area_ids: manualData.area_ids,
            }),
          }),
          "Horario creado correctamente",
          () => redirect("/schedules")
        );
      }
    } catch {
      showError("Error inesperado.");
    } finally {
      hideLoading();
    }
  };

  if (loading) return <Loading fullscreen text="Cargando formulario…" />;

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
              mode === m ? "bg-white shadow text-gray-900" : "text-gray-500"
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
                  onClick={() => setAutoData({ ...autoData, shift_id: s.id })}
                  className={`card-option ${
                    autoData.shift_id === s.id ? "card-option-active" : ""
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
          {/* EMPLOYEES */}
          <div className="space-y-2">
            <label className="label">Empleado</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {manualEmployees.map((e) => {
                const disabled = e.disabled;

                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      if (disabled) return;
                      setManualData({ ...manualData, employee_id: e.id });
                    }}
                    className={`card-option ${
                      manualData.employee_id === e.id
                        ? "card-option-active"
                        : ""
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div>
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-gray-500">{e.role}</p>

                      {disabled && (
                        <p className="text-xs text-red-500 mt-1">{e.reason}</p>
                      )}
                    </div>

                    <input
                      type="radio"
                      checked={manualData.employee_id === e.id}
                      disabled={disabled}
                      readOnly
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* AREAS (MANUAL CONTEXT) */}
          <div className="space-y-2">
            <label className="label">Áreas disponibles</label>

            {/* 👇 AQUÍ VA */}
            {!manualData.employee_id && (
              <p className="text-sm text-gray-400">
                Selecciona un empleado para ver áreas disponibles
              </p>
            )}

            {loadingAreas && (
              <p className="text-sm text-gray-400">Cargando áreas…</p>
            )}

            {!loadingAreas && manualAreas.length === 0 && (
              <p className="text-sm text-gray-400">
                No hay áreas disponibles para este empleado en esta fecha.
              </p>
            )}

            <div className="grid sm:grid-cols-3 gap-3">
              {manualAreas.map((a) => {
                const checked = manualData.area_ids.includes(a.id);

                const selected = manualAreas.filter((x) =>
                  manualData.area_ids.includes(x.id)
                );

                const disabled =
                  a.disabled || (!checked && !canSelectArea(a, selected));
                return (
                  <label
                    key={a.id}
                    className={`card-option items-start gap-3 ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox mt-1"
                      disabled={disabled}
                      checked={checked}
                      onChange={() =>
                        setManualData((p) => ({
                          ...p,
                          area_ids: checked
                            ? p.area_ids.filter((id) => id !== a.id)
                            : [...p.area_ids, a.id],
                        }))
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-gray-400">
                        Zona {a.zone} · Nivel {a.complexity_level}
                      </p>

                      {a.disabled && (
                        <p className="text-xs text-red-500 mt-1">{a.reason}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SHIFTS */}
          <div className="space-y-2">
            <label className="label">Turno</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {shifts.map((s) => (
                <div
                  key={s.id}
                  onClick={() =>
                    setManualData((p) => ({ ...p, shift_id: s.id }))
                  }
                  className={`card-option ${
                    manualData.shift_id === s.id ? "card-option-active" : ""
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
                    checked={manualData.shift_id === s.id}
                    readOnly
                  />
                </div>
              ))}
            </div>
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
