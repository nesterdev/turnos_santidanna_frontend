import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/utils/fetch";
import { redirect } from "../../lib/utils/navigation";
import { showError } from "../../lib/utils/alert";
import { canSelectArea } from "../../lib/rules/scheduleAreas";
import { apiAction } from "../../lib/utils/apiAction";
import { useScheduleFormData } from "../../hooks/useScheduleFormData";
import { hideLoading, showLoading } from "../../lib/utils/loading";
import Loading from "../ui/Loading";
import AutomaticMode from "./AutomaticMode";
import ManualMode from "./ManualMode";
import BulkManualMode from "./BulkManualMode";

export default function ScheduleForm() {
  const { employees, shifts, areas, loading } = useScheduleFormData();

  const [manualAreas, setManualAreas] = useState([]);
  const [manualEmployees, setManualEmployees] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [mode, setMode] = useState("automatic");

  // Estado de empleados y áreas enriquecidos para el modo masivo
  const [bulkEmployees, setBulkEmployees] = useState([]);
  const [bulkAreas, setBulkAreas] = useState([]);
  const [loadingBulkContext, setLoadingBulkContext] = useState(false);

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

  const [bulkData, setBulkData] = useState({
    date: "",
    shift_id: null,
    assignments: [], // [{ employee_id: 1, area_ids: [1, 2] }]
  });

  // Cargar disponibilidad y restricciones en modo Manual
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
            manualData.employee_id ? `&employee_id=${manualData.employee_id}` : ""
          }`
        );

        if (res?.success) {
          setManualEmployees(res.employees || []);
          setManualAreas(res.areas || []);
          setManualData((p) => ({ ...p, area_ids: [] }));
        }
      } finally {
        setLoadingAreas(false);
      }
    }

    loadContext();
  }, [mode, manualData.date, manualData.employee_id]);

  // Cargar disponibilidad y restricciones en modo Bulk
  useEffect(() => {
    if (mode !== "bulk" || !bulkData.date) {
      setBulkEmployees([]);
      setBulkAreas([]);
      return;
    }

    async function loadBulkContext() {
      setLoadingBulkContext(true);
      try {
        const res = await apiFetch(
          `/schedules/manual-context?date=${bulkData.date}`
        );
        if (res?.success) {
          setBulkEmployees(res.employees || []);
          setBulkAreas(res.areas || []);
        }
      } finally {
        setLoadingBulkContext(false);
      }
    }

    loadBulkContext();
  }, [mode, bulkData.date]);

  // Función para formatear fechas a ISO (YYYY-MM-DD)
  const formatDateToISO = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr;
  };

  const submit = async (e) => {
    e.preventDefault();
    showLoading("Guardando horario…");
    try {
      if (mode === "automatic") {
        await apiAction(
          apiFetch("/schedules/generate", {
            method: "POST",
            body: JSON.stringify({
              start_date: formatDateToISO(autoData.start_date),
              end_date: formatDateToISO(autoData.end_date || autoData.start_date),
              capacity_default: Number(autoData.capacity),
              shift_id: autoData.shift_id ? Number(autoData.shift_id) : null,
            }),
          }),
          "Horarios generados correctamente",
          () => redirect("/schedules")
        );
      } else if (mode === "manual") {
        await apiAction(
          apiFetch("/schedules", {
            method: "POST",
            body: JSON.stringify({
              employee_id: Number(manualData.employee_id),
              shift_id: Number(manualData.shift_id),
              date: formatDateToISO(manualData.date),
              area_ids: manualData.area_ids.map(Number),
            }),
          }),
          "Horario creado correctamente",
          () => redirect("/schedules")
        );
      } else if (mode === "bulk") {
        await apiAction(
          apiFetch("/schedules/bulk", {
            method: "POST",
            body: JSON.stringify({
              date: formatDateToISO(bulkData.date),
              shift_id: Number(bulkData.shift_id),
              assignments: bulkData.assignments.map((item) => ({
                employee_id: Number(item.employee_id),
                area_ids: (item.area_ids || []).map(Number),
              })),
            }),
          }),
          "Horarios masivos creados correctamente",
          () => redirect("/schedules")
        );
      }
    } catch {
      showError("Error inesperado al procesar la solicitud.");
    } finally {
      hideLoading();
    }
  };

  if (loading) return <Loading fullscreen text="Cargando formulario…" />;

  return (
    <form
      onSubmit={submit}
      className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-10 space-y-8 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Asignación de horarios</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configura asignación automática, manual o asignación masiva de áreas.
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100/80 p-1.5 rounded-xl w-fit">
        {[
          { id: "automatic", label: "Automático" },
          { id: "manual", label: "Manual" },
          { id: "bulk", label: "Manual Masivo" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "automatic" && (
        <AutomaticMode
          autoData={autoData}
          setAutoData={setAutoData}
          shifts={shifts}
        />
      )}

      {mode === "manual" && (
        <ManualMode
          manualData={manualData}
          setManualData={setManualData}
          manualEmployees={manualEmployees}
          manualAreas={manualAreas}
          shifts={shifts}
          loadingAreas={loadingAreas}
          employeeFilter={employeeFilter}
          setEmployeeFilter={setEmployeeFilter}
          canSelectArea={canSelectArea}
        />
      )}

      {mode === "bulk" && (
        <BulkManualMode
          bulkData={bulkData}
          setBulkData={setBulkData}
          employees={bulkEmployees.length ? bulkEmployees : employees}
          areas={bulkAreas.length ? bulkAreas : areas}
          shifts={shifts}
          loadingContext={loadingBulkContext}
          canSelectArea={canSelectArea}
        />
      )}

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#FF3131] hover:bg-red-600 text-white font-semibold shadow-md shadow-red-500/10 transition active:scale-[0.98]"
        >
          {mode === "automatic"
            ? "Generar horarios"
            : mode === "manual"
            ? "Crear horario"
            : "Asignar masivamente"}
        </button>
      </div>
    </form>
  );
}