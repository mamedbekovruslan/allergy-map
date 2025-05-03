import type { ForecastPoint } from "@/types/forecast";
import { getPollenLevel } from "@/utils/getPollenLevel";

export async function fetchDistrict(
  lat: number,
  lon: number,
  name: string,
  allergen: string
): Promise<ForecastPoint | null> {
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=${allergen}_pollen&timezone=UTC`
    );
    const json = await res.json();
    const value = json.hourly?.[`${allergen}_pollen`]?.[0] ?? 0;
    return {
      lat,
      lng: lon,
      value,
      level: getPollenLevel(value),
      name,
    };
  } catch {
    return null;
  }
}
