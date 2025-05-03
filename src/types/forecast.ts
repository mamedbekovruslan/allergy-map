export type ForecastLevel = "Низкий" | "Средний" | "Высокий";

export type ForecastPoint = {
  lat: number;
  lng: number;
  level: ForecastLevel;
  value: number;
  name?: string;
};
