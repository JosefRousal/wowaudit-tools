/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { wow } from "blizzard.js";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  PlayableClassIndexResponseSchema,
  PlayableClassResponseSchema,
} from "~/battlenet/types";
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
  const rosterResponse = await wowClient.guild({
    realm: "sargeras",
    name: "intimidation",
    resource: "roster",
  });
  if (rosterResponse.status !== 200) return;

  for (const item of rosterResponse.data.members) {
    const rank = item.rank;
    const character = item.character;
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
}
