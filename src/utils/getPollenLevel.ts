import type { ForecastLevel } from "@/types/forecast";

export function getPollenLevel(value: number): ForecastLevel {
  if (value < 10) return "Низкий";
  if (value < 20) return "Средний";
  return "Высокий";
}
