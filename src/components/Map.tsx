import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";

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
      center={[20, 0]}
      zoom={2}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((point, index) => (
        <Circle
          key={index}
          center={[point.lat, point.lng]}
          radius={300000} // примерно 300км радиус
          pathOptions={{ color: getColor(point.level), fillOpacity: 0.5 }}
        >
          <Popup>
            {point.lat}, {point.lng}
            <br />
            Уровень: <strong>{point.level}</strong>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
