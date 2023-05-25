import { wow } from "blizzard.js";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import getCharacters from "~/wowaudit/characters/get-characters";

export const charactersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const wowClient = await wow.createInstance({
      key: env.BATTLENET_CLIENT_ID,
      secret: env.BATTLENET_CLIENT_SECRET,
      origin: "us",
      locale: "en_US",
      token: "",
    });
    const result = await wowClient.guild({
      realm: "sargeras",
      name: "intimidation",
      resource: "roster",
    });
    console.log(result.data.members[0].character)
  }),
});
