import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getHistoricalData from "~/wowaudit/characters/getHistoricalData";

export const checkVaultRouter = createTRPCRouter({
  getData: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        week: z.number(),
      })
    )
    .query(async ({ input }) => {
      const data = await getHistoricalData(input.year, input.week);
      return data.characters.map((c) => ({
        id: c.id,
        name: c.name,
        vaultOne: c.data?.vault_options.dungeons.option_1,
        vaultTwo: c.data?.vault_options.dungeons.option_2,
        vaultThree: c.data?.vault_options.dungeons.option_3,
      }));
    }),
});
