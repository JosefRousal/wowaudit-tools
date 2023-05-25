import { wow } from "blizzard.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export default async function handler(
  request: NextApiRequest,
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
    await prisma.character.upsert({
      where: {
        id: character.id,
      },
      create: {
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
