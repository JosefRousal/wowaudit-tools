import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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
    .input(
      z.object({
        wishlistName: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const data = await getWishlists();
      const resultMap = new Map<string, CharacterWishlistUploadInfo>();

      data.map((character) => {
        const currentTierInfo = character.wishlists
          .find((x) => x.name === input.wishlistName ?? "Overall")
          ?.instances.find((x) => x.id === 17);

        difficulties.map((difficulty) => {
          const difficultyInfo = currentTierInfo?.difficulties.find(
            (x) => x.difficulty === difficulty
          );
          if (!difficultyInfo) return;
          const uploadDateInfo =
            difficultyInfo.wishlist.wishlist.report_uploaded_at;
          if (uploadDateInfo) {
            Object.keys(uploadDateInfo).map((item) => {
              const difficultyDate = uploadDateInfo[item];
              if (!difficultyDate) return;
              const existing = resultMap.get(character.name);
              if (!existing) {
                resultMap.set(character.name, {
                  characterName: character.name,
                  spec: item,
                  [difficulty]: difficultyDate,
                } as CharacterWishlistUploadInfo);
              } else {
                existing[difficulty] = difficultyDate;
              }
            });
          }
        });
      });

      return Array.from<
        [string, CharacterWishlistUploadInfo],
        CharacterWishlistUploadInfo
      >(resultMap, ([_, uploadInfo]) => uploadInfo);
    }),
});
