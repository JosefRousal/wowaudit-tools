import { type SpecTierSim, SpecTierSimSchema } from "./types";

export default async function getSpecTierSims(
  className: string,
  specName: string
): Promise<SpecTierSim | null> {
  const url = `https://bloodmallet.com/chart/get/tier_set/castingpatchwerk/${className}/${specName}`;
  const response = await fetch(url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await response.json();
  try {
    return SpecTierSimSchema.parse(json);
  } catch (e) {
    console.warn("Failed to query spec sim data", className, specName, json);
  }
  return null;
}
