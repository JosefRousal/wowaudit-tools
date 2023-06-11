import type { NextApiRequest, NextApiResponse } from "next/types";
import loadCharacters from "~/server/api/loadCharacters";

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  await loadCharacters();
  response.status(200);
  response.end();
}
