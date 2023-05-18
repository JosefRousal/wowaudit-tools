import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";

type Difficulty = "normal" | "heroic" | "mythic";

const headers = {
  accept: "application/json",
  Authorization: env.WOWAUDIT_KEY,
};

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
          difficulty: z.enum(["normal", "heroic", "mythic"]),
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

type SpecWishlistUploadInfo = {
  difficulty: Difficulty;
  spec: string;
  uploadDate: Date | null;
};

export const wishlistRouter = createTRPCRouter({
  characterWishlist: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const url = new URL(`/v1/wishlists/${input}`, env.WOWAUDIT_URL);
      const response = await fetch(url, {
        headers: new Headers(headers),
      });
      if (!response.ok) {
        throw new Error(`Received status code ${response.status}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return CharacterWishlistSchema.parse(json);
    }),
  characterWishlistUploadInfo: publicProcedure
    .input(
      z.object({
        characterId: z.number(),
        wishlistName: z.string(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(
        `/v1/wishlists/${input.characterId}`,
        env.WOWAUDIT_URL
      );
      const response = await fetch(url, {
        headers: new Headers(headers),
      });
      if (!response.ok) {
        throw new Error(`Received status code ${response.status}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const data = CharacterWishlistSchema.parse(json);

      const currentTierInfo = data.wishlists
        .find((x) => x.name === input.wishlistName ?? "Overall")
        ?.instances.find((x) => x.id === 17);

      const result: SpecWishlistUploadInfo[] = [];

      ["normal", "heroic", "mythic"].map((difficulty) => {
        const difficultyInfo = currentTierInfo?.difficulties.find(
          (x) => x.difficulty === difficulty
        );
        const uploadDateInfo =
          difficultyInfo?.wishlist.wishlist.report_uploaded_at;
        if (uploadDateInfo) {
          Object.keys(uploadDateInfo).map((item) => {
            result.push({
              difficulty,
              spec: item,
              uploadDate: uploadDateInfo[item],
            } as SpecWishlistUploadInfo);
          });
        }
      });

      return result;
    }),
});
