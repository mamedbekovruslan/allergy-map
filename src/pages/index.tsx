import { GetServerSideProps } from "next";
import { Select, Layout, Typography, Spin } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { fetchPollenData } from "@/pages/api/fetchPollenData";
import { ForecastPoint } from "@/types/forecast";
import { allergenOptions } from "@/utils/allergenOptions";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Map = dynamic(() => import("@/components/PollenMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "600px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" />
    </div>
  ),
});

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
        <Title level={3}>Аллергокарта</Title>
      </Header>
      <Content style={{ padding: 20, backgroundColor: "white" }}>
        <Select
          value={allergen}
          onChange={handleChange}
          style={{
            width: 200,
            marginBottom: 20,
            position: "absolute",
            zIndex: "999",
            left: "80px",
            top: "95px",
            border: "2px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "3px",
          }}
        >
          {allergenOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        {loading ? (
          <div
            style={{
              height: "600px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin style={{ marginLeft: "20px" }} />
          </div>
        ) : (
          <Map key={allergen} points={data} />
        )}
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
