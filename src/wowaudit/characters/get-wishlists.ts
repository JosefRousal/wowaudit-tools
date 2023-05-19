import { z } from "zod";
import { env } from "~/env.mjs";
import {
  CharacterWishlistSchema,
  type WowAuditCharacterWishlist,
} from "./types";
import getHeaders from "../get-headers";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await response.json();

  return z
    .object({
      characters: z.array(CharacterWishlistSchema),
    })
    .transform((x) => x.characters)
    .parse(json);
}
