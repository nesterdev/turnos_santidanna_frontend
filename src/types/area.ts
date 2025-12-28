export interface Area {
  id: number;
  name: string;
  zone: string | number;
  complexity_level: number;
  disabled?: boolean;
  reason?: string;
}
