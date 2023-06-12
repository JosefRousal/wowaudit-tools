import { env } from "~/env.mjs";
import getHeaders from "../get-headers";
import { z } from "zod";

const HistoricalDataSchema = z.object({
  year: z.number(),
  week_number: z.number(),
  characters: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      realm: z.string(),
      data: z
        .object({
          dungeons_done: z.array(
            z.object({
              level: z.number(),
              dungeon: z.number(),
            })
          ),
          world_quests_done: z.number(),
          vault_options: z.object({
            raids: z.object({
              option_1: z.number().nullable(),
              option_2: z.number().nullable(),
              option_3: z.number().nullable(),
            }),
            dungeons: z.object({
              option_1: z.number().nullable(),
              option_2: z.number().nullable(),
              option_3: z.number().nullable(),
            }),
            pvp: z.object({
              option_1: z.number().nullable(),
              option_2: z.number().nullable(),
              option_3: z.number().nullable(),
            }),
          }),
        })
        .nullish(),
    })
  ),
});

type WowAuditHistoricalData = z.infer<typeof HistoricalDataSchema>;

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
  return HistoricalDataSchema.parse(await r.json());
}
