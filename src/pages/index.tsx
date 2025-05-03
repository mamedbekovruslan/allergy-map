import { GetServerSideProps } from "next";
import { Select, Layout, Typography } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export type ForecastPoint = {
  lat: number;
  lng: number;
  level: "low" | "moderate" | "high";
  value: number;
  name?: string;
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

  const districts = [
    { name: "Тверской", lat: 55.765, lon: 37.605 },
    { name: "Арбат", lat: 55.752, lon: 37.586 },
    { name: "Пресненский", lat: 55.76, lon: 37.56 },
    { name: "Хамовники", lat: 55.735, lon: 37.58 },
    { name: "Басманный", lat: 55.765, lon: 37.65 },
    { name: "Таганский", lat: 55.741, lon: 37.657 },
    { name: "Замоскворечье", lat: 55.732, lon: 37.628 },
    { name: "Мещанский", lat: 55.78, lon: 37.625 },
    { name: "Красносельский", lat: 55.78, lon: 37.65 },
    { name: "Якиманка", lat: 55.731, lon: 37.61 },
    { name: "Беговой", lat: 55.78, lon: 37.56 },
    { name: "Сокол", lat: 55.805, lon: 37.51 },
    { name: "Аэропорт", lat: 55.8, lon: 37.53 },
    { name: "Даниловский", lat: 55.698, lon: 37.63 },
    { name: "Донской", lat: 55.7, lon: 37.6 },
    { name: "Нагорный", lat: 55.658, lon: 37.61 },
    { name: "Академический", lat: 55.683, lon: 37.575 },
    { name: "Ломоносовский", lat: 55.683, lon: 37.53 },
    { name: "Гагаринский", lat: 55.7, lon: 37.57 },
    { name: "Раменки", lat: 55.7, lon: 37.48 },
    { name: "Филёвский Парк", lat: 55.75, lon: 37.48 },
    { name: "Кунцево", lat: 55.73, lon: 37.45 },
    { name: "Строгино", lat: 55.8, lon: 37.4 },
    { name: "Щукино", lat: 55.8, lon: 37.47 },
    { name: "Хорошёво-Мнёвники", lat: 55.775, lon: 37.45 },
    { name: "Митино", lat: 55.84, lon: 37.36 },
    { name: "Северное Тушино", lat: 55.86, lon: 37.43 },
    { name: "Южное Тушино", lat: 55.85, lon: 37.43 },
    { name: "Марфино", lat: 55.84, lon: 37.6 },
    { name: "Бибирево", lat: 55.88, lon: 37.6 },
    { name: "Отрадное", lat: 55.86, lon: 37.6 },
    { name: "Марьина Роща", lat: 55.8, lon: 37.6 },
    { name: "Лефортово", lat: 55.77, lon: 37.7 },
    { name: "Перово", lat: 55.75, lon: 37.78 },
    { name: "Измайлово", lat: 55.78, lon: 37.77 },
    { name: "Гольяново", lat: 55.82, lon: 37.8 },
    { name: "Новогиреево", lat: 55.73, lon: 37.8 },
    { name: "Люблино", lat: 55.67, lon: 37.75 },
    { name: "Кузьминки", lat: 55.7, lon: 37.75 },
    { name: "Текстильщики", lat: 55.7, lon: 37.72 },
    { name: "Орехово-Борисово", lat: 55.61, lon: 37.74 },
    { name: "Царицыно", lat: 55.61, lon: 37.68 },
    { name: "Бирюлёво", lat: 55.58, lon: 37.65 },
    { name: "Братеево", lat: 55.63, lon: 37.76 },
    { name: "Капотня", lat: 55.64, lon: 37.79 },
  ];

  const fetchDistrictData = async (lat: number, lon: number, name: string) => {
    try {
      const res = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=${allergen}_pollen&timezone=UTC`
      );
      const json = await res.json();
      const value = json.hourly?.[`${allergen}_pollen`]?.[0] ?? 0;
      const level = value < 10 ? "low" : value < 20 ? "moderate" : "high";
      return { lat, lng: lon, level, name, value };
    } catch {
      return null;
    }
  };

  const rawData = await Promise.all(
    districts.map(({ lat, lon, name }) => fetchDistrictData(lat, lon, name))
  );

  const data = rawData.filter((item): item is ForecastPoint => item !== null);

  return {
    props: {
      initialAllergen: allergen,
      initialData: data,
    },
  };
};
