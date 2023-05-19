import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Difficulty } from "../../../types";
import getWishlists from "~/wowaudit/characters/get-wishlists";

type CharacterWishlistUploadInfo = {
  characterName: string;
  difficulty: Difficulty;
  spec: string;
  uploadDate: Date | null;
};

export const wishlistRouter = createTRPCRouter({
  allCharacterWishlistUploadInfo: publicProcedure
    .input(
      z.object({
        wishlistName: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const data = await getWishlists();
      const result: CharacterWishlistUploadInfo[] = [];

      data.map((character) => {
        const currentTierInfo = character.wishlists
          .find((x) => x.name === input.wishlistName ?? "Overall")
          ?.instances.find((x) => x.id === 17);

        ["normal", "heroic", "mythic"].map((difficulty) => {
          const difficultyInfo = currentTierInfo?.difficulties.find(
            (x) => x.difficulty === difficulty
          );
          const uploadDateInfo =
            difficultyInfo?.wishlist.wishlist.report_uploaded_at;
          if (uploadDateInfo) {
            Object.keys(uploadDateInfo).map((item) => {
              result.push({
                characterName: character.name,
                difficulty,
                spec: item,
                uploadDate: uploadDateInfo[item],
              } as CharacterWishlistUploadInfo);
            });
          }
        });
      });

      return result;
    }),
});
