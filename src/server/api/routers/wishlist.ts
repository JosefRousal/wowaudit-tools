import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type Difficulty } from "~/types";
import getWishlists from "~/wowaudit/characters/get-wishlists";

type CharacterWishlistUploadInfo = {
  characterName: string;
  spec: string;
  normal: Date | null;
  heroic: Date | null;
  mythic: Date | null;
};

const difficulties: Difficulty[] = ["normal", "heroic", "mythic"];

export const wishlistRouter = createTRPCRouter({
  allCharacterWishlistUploadInfo: publicProcedure
    .query(async () => {
      // const data = await getWishlists();
      // const resultMap = new Map<string, CharacterWishlistUploadInfo>();

      const data = await prisma.wishlistUploadInfo.findMany({
        include: {
          character: true,
          specialization: true
        }
      });
    
      return data.map(item => ({
         characterName: item.character.name,
         spec: item.specialization.name,
         normal: item.normal,
         heroic: item.heroic,
         mythic: item.mythic
      } as CharacterWishlistUploadInfo))
    }),
});
