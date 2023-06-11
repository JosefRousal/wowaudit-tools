import type { NextApiRequest, NextApiResponse } from "next/types";
import loadTierSimData from "~/server/api/loadTierSimData";

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  await loadTierSimData();
  response.status(200);
  response.end();
}
