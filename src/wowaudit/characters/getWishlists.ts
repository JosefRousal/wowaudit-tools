import { z } from "zod";
import { env } from "~/env.mjs";
import { DifficultySchema } from "~/types";
import getHeaders from "../get-headers";

const CharacterWishlistSchema = z.object({
  id: z.number(),
  name: z.string(),
  realm: z.string(),
  wishlists: z.array(
    z.object({
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
    })
  ),
});

type WowAuditCharacterWishlist = z.infer<typeof CharacterWishlistSchema>;

export default async function getWishlists(): Promise<
  WowAuditCharacterWishlist[]
> {
  const url = new URL(`/v1/wishlists/`, env.WOWAUDIT_URL);
  const response = await fetch(url, {
    headers: new Headers(getHeaders()),
  });
  if (!response.ok) {
    throw new Error(`Received status code ${response.status}`);
  }

  return z
    .object({
      characters: z.array(CharacterWishlistSchema),
    })
    .transform((x) => x.characters)
    .parse(await response.json());
}
