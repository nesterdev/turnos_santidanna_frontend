import type { Area } from "../../types/area";


export function canSelectArea(
  area: Area,
  selectedAreas: Area[]
): boolean {
  // ⛔ Área pesada: solo una
  if (area.complexity_level === 4 && selectedAreas.length > 0) return false;

  // ⛔ Si ya hay una pesada
  if (selectedAreas.some(a => a.complexity_level === 4)) return false;

  // ⛔ Máximo 2 áreas
  if (selectedAreas.length >= 2) return false;

  // ⛔ Zonas incompatibles
  if (
    selectedAreas.length === 1 &&
    selectedAreas[0].zone !== area.zone
  ) return false;

  return true;
}
