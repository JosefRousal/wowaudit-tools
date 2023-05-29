import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

type CharacterWishlistUploadInfo = {
  characterName: string;
  spec: string;
  normal: Date | null;
  heroic: Date | null;
  mythic: Date | null;
};

export const wishlistRouter = createTRPCRouter({
  allCharacterWishlistUploadInfo: publicProcedure
    .query(async () => {
      // const data = await getWishlists();
      // const resultMap = new Map<string, CharacterWishlistUploadInfo>();
      console.log('hello')
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
