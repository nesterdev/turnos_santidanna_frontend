import { useEffect, useState } from "react";
import { apiFetch } from "../lib/utils/fetch";

export function useScheduleFormData() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/employees"),
      apiFetch("/shifts"),
      apiFetch("/areas"),
    ]).then(([e, s, a]) => {
      if (e?.success) setEmployees(e.data);
      if (s?.success) setShifts(s.data);
      if (a?.success) setAreas(a.data);
    }).finally(() => setLoading(false));
  }, []);

  return { employees, shifts, areas, loading };
}
