import { z } from "zod";
import { env } from "~/env.mjs";
import { CharacterSchema, type WowAuditCharacter } from "./types";
import getHeaders from "../get-headers";

export default async function getCharacters(): Promise<WowAuditCharacter[]> {
  const response = await fetch(new URL(`/v1/characters`, env.WOWAUDIT_URL), {
    headers: new Headers(getHeaders()),
  });
  return z.array(CharacterSchema).parse(await response.json())
}
