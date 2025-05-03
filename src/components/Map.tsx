// components/Map.tsx
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import L from "leaflet";

type ForecastPoint = {
  lat: number;
  lng: number;
  level: "low" | "moderate" | "high";
};

type Props = {
  points: ForecastPoint[];
};

const getColor = (level: ForecastPoint["level"]) => {
  switch (level) {
    case "low":
      return "green";
    case "moderate":
      return "orange";
    case "high":
      return "red";
  }
};

export default function Map({ points }: Props) {
  return (
    <MapContainer
      center={[55.75, 37.61]}
      zoom={10}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((point, index) => (
        <Circle
          key={index}
          center={[point.lat, point.lng]}
          radius={1000}
          pathOptions={{ color: getColor(point.level) }}
        >
          <Popup>
            Уровень: <strong>{point.level}</strong>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
