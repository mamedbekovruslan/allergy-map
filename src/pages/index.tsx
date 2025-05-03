import { GetServerSideProps } from "next";
import { Select, Layout, Typography } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type ForecastPoint = {
  lat: number;
  lng: number;
  level: "low" | "moderate" | "high";
};

type Props = {
  initialAllergen: string;
  initialData: ForecastPoint[];
};

export default function Home({ initialAllergen, initialData }: Props) {
  const [allergen, setAllergen] = useState(initialAllergen);
  const [data, setData] = useState(initialData);

  const handleChange = async (value: string) => {
    setAllergen(value);
    const res = await fetch(`/api/forecast?allergen=${value}`);
    const json = await res.json();
    setData(json.data);
  };

  return (
    <Layout>
      <Header style={{ background: "#fff", padding: 20 }}>
        <Title level={3}>Allergy Forecast Map</Title>
      </Header>
      <Content style={{ padding: 20 }}>
        <Select
          value={allergen}
          onChange={handleChange}
          style={{ width: 200, marginBottom: 20 }}
        >
          <Option value="birch">Birch</Option>
          <Option value="ragweed">Ragweed</Option>
        </Select>
        <Map points={data} />
      </Content>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allergen = (context.query.allergen as string) || "birch";

  const cities = [
    { name: "Moscow", lat: 55.7558, lon: 37.6176 },
    // { name: "Berlin", lat: 52.52, lon: 13.405 },
    // { name: "Paris", lat: 48.8566, lon: 2.3522 },
    // { name: "New York", lat: 40.7128, lon: -74.006 },
    // { name: "Kyiv", lat: 50.45, lon: 30.523 },
    // { name: "Warsaw", lat: 52.2297, lon: 21.0122 },
    // { name: "Vienna", lat: 48.2082, lon: 16.3738 },
    // { name: "Budapest", lat: 47.4979, lon: 19.0402 },
    // { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
    // { name: "Beijing", lat: 39.9042, lon: 116.4074 },
  ];

  const fetchCityData = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=${allergen}_pollen&timezone=UTC`
      );
      const json = await res.json();
      const value = json.hourly?.[`${allergen}_pollen`]?.[0] ?? 0;
      const level = value < 10 ? "low" : value < 20 ? "moderate" : "high";
      return { lat, lng: lon, level };
    } catch {
      return null;
    }
  };

  const rawData = await Promise.all(
    cities.map(({ lat, lon }) => fetchCityData(lat, lon))
  );
  const data = rawData.filter((item): item is ForecastPoint => item !== null);

  return {
    props: {
      initialAllergen: allergen,
      initialData: data,
    },
  };
};
