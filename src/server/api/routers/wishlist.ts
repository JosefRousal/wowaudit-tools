import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import getHeaders from "../getHeaders";
import { type Difficulty, DifficultySchema } from "../../../types";



const WishlistSchema = z.object({
  name: z.string(),
  fight_style: z.string().nullish(),
  allow_sockets: z.boolean().nullish(),
  weight: z.number().nullish(),
  instances: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      difficulties: z.array(
        z.object({
          difficulty: DifficultySchema,
          wishlist: z.object({
            wishlist: z.object({
              report_uploaded_at: z.record(
                z.string(),
                z
                  .string()
                  .datetime()
                  .nullable()
                  .transform((value) => {
                    if (value) {
                      return new Date(Date.parse(value));
                    }
                    return null;
                  })
              ),
            }),
          }),
        })
      ),
    })
  ),
});

const CharacterWishlistSchema = z.object({
  id: z.number(),
  name: z.string(),
  realm: z.string(),
  wishlists: z.array(WishlistSchema),
});

// type SpecWishlistUploadInfo = {
//   difficulty: Difficulty;
//   spec: string;
//   uploadDate: Date | null;
// };

type CharacterWishlistUploadInfo = {
  characterName: string;
  difficulty: Difficulty;
  spec: string;
  uploadDate: Date | null;
};

export const wishlistRouter = createTRPCRouter({
  // characterWishlist: publicProcedure
  //   .input(z.number())
  //   .query(async ({ input }) => {
  //     const url = new URL(`/v1/wishlists/${input}`, env.WOWAUDIT_URL);
  //     const response = await fetch(url, {
  //       headers: new Headers(getHeaders()),
  //     });
  //     if (!response.ok) {
  //       throw new Error(`Received status code ${response.status}`);
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     const json = await response.json();
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return CharacterWishlistSchema.parse(json);
  //   }),
  allCharacterWishlistUploadInfo: publicProcedure
    .input(
      z.object({
        wishlistName: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`/v1/wishlists/`, env.WOWAUDIT_URL);
      const response = await fetch(url, {
        headers: new Headers(getHeaders()),
      });
      if (!response.ok) {
        throw new Error(`Received status code ${response.status}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const data = z
        .object({
          characters: z.array(CharacterWishlistSchema),
        })
        .parse(json);

      const result: CharacterWishlistUploadInfo[] = [];

      data.characters.map((character) => {
        const currentTierInfo = character.wishlists
          .find((x) => x.name === input.wishlistName ?? "Overall")
          ?.instances.find((x) => x.id === 17);

        // const result: SpecWishlistUploadInfo[] = [];

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
  // characterWishlistUploadInfo: publicProcedure
  //   .input(
  //     z.object({
  //       characterId: z.number(),
  //       wishlistName: z.string(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const url = new URL(
  //       `/v1/wishlists/${input.characterId}`,
  //       env.WOWAUDIT_URL
  //     );
  //     const response = await fetch(url, {
  //       headers: new Headers(getHeaders()),
  //     });
  //     if (!response.ok) {
  //       throw new Error(`Received status code ${response.status}`);
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     const json = await response.json();
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     const data = CharacterWishlistSchema.parse(json);

  //     const currentTierInfo = data.wishlists
  //       .find((x) => x.name === input.wishlistName ?? "Overall")
  //       ?.instances.find((x) => x.id === 17);

  //     const result: SpecWishlistUploadInfo[] = [];

  //     ["normal", "heroic", "mythic"].map((difficulty) => {
  //       const difficultyInfo = currentTierInfo?.difficulties.find(
  //         (x) => x.difficulty === difficulty
  //       );
  //       const uploadDateInfo =
  //         difficultyInfo?.wishlist.wishlist.report_uploaded_at;
  //       if (uploadDateInfo) {
  //         Object.keys(uploadDateInfo).map((item) => {
  //           result.push({
  //             difficulty,
  //             spec: item,
  //             uploadDate: uploadDateInfo[item],
  //           } as SpecWishlistUploadInfo);
  //         });
  //       }
  //     });

  //     return result;
  //   }),
});
