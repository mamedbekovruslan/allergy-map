import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const allergen = req.query.allergen as string;

  const mockData = {
    birch: [
      { lat: 55.75, lng: 37.61, level: "high" },
      { lat: 55.73, lng: 37.6, level: "moderate" },
    ],
    ambrosia: [{ lat: 55.76, lng: 37.62, level: "low" }],
  };

  res
    .status(200)
    .json({ data: mockData[allergen as keyof typeof mockData] || [] });
};

export default handler;
