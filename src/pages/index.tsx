import { GetServerSideProps } from "next";
import { Select, Layout, Typography, Spin } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { fetchPollenData } from "@/api/fetchPollenData";
import { ForecastPoint } from "@/types/forecast";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Map = dynamic(() => import("@/components/PollenMap"), { ssr: false });

type Props = {
  initialAllergen: string;
  initialData: ForecastPoint[];
};

export default function Home({ initialAllergen, initialData }: Props) {
  const [allergen, setAllergen] = useState(initialAllergen);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: string) => {
    setAllergen(value);
    setLoading(true);
    try {
      const res = await fetch(`/api/forecast?allergen=${value}`);
      const json = await res.json();
      setData(json.data);
    } finally {
      setLoading(false);
    }
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
        {loading ? <Spin /> : <Map points={data} />}
      </Content>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allergen = (context.query.allergen as string) || "birch";
  const data = await fetchPollenData(allergen);

  return {
    props: {
      initialAllergen: allergen,
      initialData: data,
    },
  };
};
