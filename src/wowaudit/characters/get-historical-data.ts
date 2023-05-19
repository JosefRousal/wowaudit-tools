import { env } from "~/env.mjs";
import getHeaders from "../get-headers";
import { HistoricalDataSchema, type WowAuditHistoricalData } from "./types";

export default async function getHistoricalData(
  year: number,
  week: number
): Promise<WowAuditHistoricalData> {
  const r = await fetch(
    new URL(`/v1/historical_data?year=${year}&week=${week}`, env.WOWAUDIT_URL),
    {
      headers: new Headers(getHeaders()),
    }
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await r.json();
  return HistoricalDataSchema.parse(json);
}
