import { z } from "zod";

export const CharacterHistorySchema = z.object({
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
      world_quests_done: z.number().nullish(),
      highest_keystone_done: z.number().nullish(),
      vault_options: z.object({
        raids: z.object({
          option_1: z.number().nullish(),
          option_2: z.number().nullish(),
          option_3: z.number().nullish(),
        }),
        dungeons: z.object({
          option_1: z.number().nullish(),
          option_2: z.number().nullish(),
          option_3: z.number().nullish(),
        }),
        pvp: z.object({
          option_1: z.number().nullish(),
          option_2: z.number().nullish(),
          option_3: z.number().nullish(),
        }),
      }),
    })
    .nullable(),
});

export const WeekHistorySchema = z.object({
  year: z.number(),
  week_number: z.number(),
  characters: z.array(CharacterHistorySchema),
});

export type CharacterHistory = z.infer<typeof CharacterHistorySchema>;

export type WeekHistory = z.infer<typeof WeekHistorySchema>;

export type CharacterVaultStats = {
  id: number;
  name: string;
  vaultOne?: number;
  vaultTwo?: number;
  vaultThree?: number;
};
