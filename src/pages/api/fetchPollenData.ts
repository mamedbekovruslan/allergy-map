import { districts } from "@/utils/districts";
import { fetchDistrict } from "./fetchDistricts";

export async function fetchPollenData(allergen: string) {
  const rawData = await Promise.all(
    districts.map(({ lat, lon, name }) =>
      fetchDistrict(lat, lon, name, allergen)
    )
  );

  return rawData.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );
}
