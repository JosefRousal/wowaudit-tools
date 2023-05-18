import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";

const headers = {
  accept: "application/json",
  Authorization: env.WOWAUDIT_KEY,
};

const CharacterSchema = z
  .object({
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
  .transform((x) => ({
    id: x.id,
    name: x.name,
    realm: x.realm,
    class: x.class,
    role: x.role,
    rank: x.rank,
    status: x.status,
    note: x.note,
    blizzardId: x.blizzard_id,
    trackingSince: x.tracking_since,
  }));

export type WowauditCharacter = z.infer<typeof CharacterSchema>;

export const charactersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const r = await fetch(new URL(`/v1/characters`, env.WOWAUDIT_URL), {
      headers: new Headers(headers),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await r.json();
    return z.array(CharacterSchema).parse(json);
  }),
});
