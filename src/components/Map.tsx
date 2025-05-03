import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ForecastPoint } from "@/pages";

type Props = {
  points: ForecastPoint[];
};

const getColor = (level: ForecastPoint["level"]) => {
  switch (level) {
    case "low":
      return "#4caf50";
    case "moderate":
      return "#ff9800";
    case "high":
      return "#f44336";
  }
};

export default function Map({ points }: Props) {
  return (
    <MapContainer
      center={[55.75, 37.61]}
      zoom={10}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((point, index) => {
        const icon = L.divIcon({
          className: "custom-div-icon",
          html: `
            <div style="
              background:${getColor(point.level)};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: #fff;
              font-size: 14px;
              box-shadow: 0 0 3px rgba(0,0,0,0.3);
            ">
              <div style="transform: rotate(45deg);">${point.value}</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        return (
          <Marker key={index} position={[point.lat, point.lng]} icon={icon}>
            <Popup>
              <strong>{point.name}</strong>
              <br />
              Уровень: {point.level}
              <br />
              Координаты: {point.lat}, {point.lng}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
