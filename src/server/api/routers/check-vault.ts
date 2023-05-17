import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { WeekHistorySchema, type CharacterVaultStats } from "../types";
import { env } from "~/env.mjs";

const headers = {
  accept: "application/json",
  Authorization: env.WOWAUDIT_KEY,
};

const url = (year: number, week: number) =>
  new URL(`/v1/historical_data?year=${year}&week=${week}`, env.WOWAUDIT_URL);

export const checkVaultRouter = createTRPCRouter({
  getData: publicProcedure
    .input(
      z.object({
        year: z.number(),
        week: z.number()
      })
    )
    .query(async ({ input }) => {
      const year = input.year;
      const week = input.week;
      console.log(year, week)
      const r = await fetch(url(year, week), {
        headers: new Headers(headers),
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await r.json();
      const data = WeekHistorySchema.parse(json);
      return data.characters.map(
        (c) =>
          ({
            id: c.id,
            name: c.name,
            vaultOne: c.data?.vault_options.dungeons.option_1,
            vaultTwo: c.data?.vault_options.dungeons.option_2,
            vaultThree: c.data?.vault_options.dungeons.option_3,
          } as CharacterVaultStats)
      );
    }),
});
