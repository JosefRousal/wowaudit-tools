import { wow } from "blizzard.js";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { env } from "~/env.mjs";
import characters from "~/server/drizzle/schema/characters";
import upsert from "~/server/drizzle/upsert";

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  const wowClient = await wow.createInstance({
    key: env.BATTLENET_CLIENT_ID,
    secret: env.BATTLENET_CLIENT_SECRET,
    origin: "us",
    locale: "en_US",
    token: "",
  });
  const rosterResponse = await wowClient.guild<{
    members: {
      character: {
        id: number;
        name: string;
        playable_class: {
          id: number;
        };
      };
      rank: number;
    }[];
  }>({
    realm: "sargeras",
    name: "intimidation",
    resource: "roster",
  });
  if (rosterResponse.status !== 200) return;

  for (const item of rosterResponse.data.members) {
    const rank = item.rank;
    const character = item.character;
    if (![1, 3, 4].find((x) => x === rank)) continue;
    await upsert({
      table: characters,
      match: eq(characters.id, item.character.id),
      insert: {
        id: character.id,
        name: character.name,
        classId: character.playable_class.id,
        guildRank: rank,
      },
      update: {
        name: character.name,
        classId: character.playable_class.id,
        guildRank: rank,
      },
    });
  }
  response.status(200);
  response.end();
}
