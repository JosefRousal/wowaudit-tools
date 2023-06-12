import { z } from "zod";
import { env } from "~/env.mjs";
import getHeaders from "../get-headers";

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

type WowAuditCharacter = z.infer<typeof CharacterSchema>;

export default async function getCharacters(): Promise<WowAuditCharacter[]> {
  const response = await fetch(new URL(`/v1/characters`, env.WOWAUDIT_URL), {
    headers: new Headers(getHeaders()),
  });
  return z.array(CharacterSchema).parse(await response.json());
}
