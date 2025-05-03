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
          <Option value="ambrosia">Ambrosia</Option>
        </Select>
        <Map points={data} />
      </Content>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allergen = (context.query.allergen as string) || "birch";

  const mockData = {
    birch: [
      { lat: 55.75, lng: 37.61, level: "high" },
      { lat: 55.73, lng: 37.6, level: "moderate" },
    ],
    ambrosia: [{ lat: 55.76, lng: 37.62, level: "low" }],
  };

  return {
    props: {
      initialAllergen: allergen,
      initialData: mockData[allergen as keyof typeof mockData] || [],
    },
  };
};
