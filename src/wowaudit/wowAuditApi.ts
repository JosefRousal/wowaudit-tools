import { Zodios } from "@zodios/core";
import { env } from "~/env.mjs";
import { z } from "zod";
import { DifficultySchema } from "~/types";

const api = new Zodios(
  env.WOWAUDIT_URL.toString(),
  [
    {
      method: "get",
      path: "/v1/characters",
      alias: "getCharacters",
      response: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          realm: z.string(),
          class: z.string(),
          role: z.string(),
          rank: z.string(),
          status: z.string(),
          note: z.string().nullable(),
          blizzard_id: z.number(),
          tracking_since: z.string().datetime(),
        })
      ),
    },
    {
      method: "get",
      path: "/v1/historical_data",
      alias: "getHistoricalData",
      parameters: [
        {
          name: "year",
          type: "Query",
          schema: z.number(),
        },
        {
          name: "week",
          type: "Query",
          schema: z.number(),
        },
      ],
      response: z.object({
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
      }),
    },
    {
      method: "get",
      path: "/v1/wishlists",
      alias: "getWishlists",
      response: z.object({
        characters: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            realm: z.string(),
            wishlists: z.array(
              z.object({
                name: z.string(),
                fight_style: z.string().nullish(),
                allow_sockets: z.boolean().nullish(),
                weight: z.number().nullish(),
                instances: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    difficulties: z.array(
                      z.object({
                        difficulty: DifficultySchema,
                        wishlist: z.object({
                          wishlist: z.object({
                            report_uploaded_at: z.record(
                              z.string(),
                              z
                                .string()
                                .datetime()
                                .nullable()
                                .transform((value) => {
                                  if (value) {
                                    return new Date(Date.parse(value));
                                  }
                                  return null;
                                })
                            ),
                          }),
                        }),
                      })
                    ),
                  })
                ),
              })
            ),
          })
        ),
      }),
    },
  ],
  {
    axiosConfig: {
      headers: {
        accept: "application/json",
        Authorization: env.WOWAUDIT_KEY,
      },
    },
  }
);

export default api;
