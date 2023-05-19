import { z } from "zod";
import { env } from "~/env.mjs";
import { CharacterSchema, type WowAuditCharacter } from "./types";
import getHeaders from "../get-headers";

export default async function getCharacters(): Promise<WowAuditCharacter[]> {
  const response = await fetch(new URL(`/v1/characters`, env.WOWAUDIT_URL), {
    headers: new Headers(getHeaders()),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await response.json();
  return z.array(CharacterSchema).parse(json);
}
