import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import getCharacters from "~/wowaudit/characters/get-characters";

export const charactersRouter = createTRPCRouter({
  getAll: publicProcedure.query(getCharacters),
});
