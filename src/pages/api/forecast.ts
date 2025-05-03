import type { NextApiRequest, NextApiResponse } from "next";
import { fetchPollenData } from "@/pages/api/fetchPollenData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allergen = req.query.allergen as string;

  if (!allergen) {
    return res.status(400).json({ error: "Allergen is required" });
  }

  const data = await fetchPollenData(allergen);
  res.status(200).json({ data });
}
