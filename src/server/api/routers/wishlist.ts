import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import loadClassSpecInfo from "../loadClassSpecInfo";

type CharacterWishlistUploadInfo = {
  characterName: string;
  spec: string;
  normal: Date | null;
  heroic: Date | null;
  mythic: Date | null;
};

export const wishlistRouter = createTRPCRouter({
  allCharacterWishlistUploadInfo: publicProcedure.query(async () => {
    const data = await prisma.wishlistUploadInfo.findMany({
      include: {
        character: true,
        specialization: true,
      },
    });

    const syncHistory = await prisma.syncHistory.findFirst({
      where: {
        reportName: "wishlist-upload-dates",
      },
    });

    return {
      lastSyncDate: syncHistory?.timestamp,
      data: data.map(
        (item) =>
          ({
            characterName: item.character.name,
            spec: item.specialization.name,
            normal: item.normal,
            heroic: item.heroic,
            mythic: item.mythic,
          } as CharacterWishlistUploadInfo)
      ),
    };
  }),
  refreshData: publicProcedure.mutation(async () => {
    await loadClassSpecInfo();
  }),
});
