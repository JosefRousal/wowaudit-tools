import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import loadWishlistUploadDates from "../loadWishlistUploadDates";
import db from "~/server/drizzle/db";
import { eq } from "drizzle-orm";
import {
  wishlistUploads,
  characters,
  specializations,
  syncHistory
} from "~/server/drizzle/schema";

type CharacterWishlistUploadInfo = {
  characterName: string;
  spec: string;
  normal: Date | null;
  heroic: Date | null;
  mythic: Date | null;
};

export const wishlistRouter = createTRPCRouter({
  allCharacterWishlistUploadInfo: publicProcedure.query(async () => {
    const syncHistoryData = await db
      .select({
        timestamp: syncHistory.timestamp,
      })
      .from(syncHistory)
      .where(eq(syncHistory.reportName, "wishlist-upload-dates"));

    const uploadDate = syncHistoryData
      ? syncHistoryData[0]
        ? syncHistoryData[0].timestamp
        : null
      : null;

    const wishlistUploadData = await db
      .select({
        characterName: characters.name,
        spec: specializations.name,
        normal: wishlistUploads.normal,
        heroic: wishlistUploads.heroic,
        mythic: wishlistUploads.mythic,
      })
      .from(wishlistUploads)
      .innerJoin(
        specializations,
        eq(wishlistUploads.specializationId, specializations.id)
      )
      .innerJoin(characters, eq(wishlistUploads.characterId, characters.id));

    return {
      lastSyncDate: uploadDate,
      data: wishlistUploadData as CharacterWishlistUploadInfo[],
    };
  }),
  refreshData: publicProcedure.mutation(async () => {
    await loadWishlistUploadDates();
  }),
});
