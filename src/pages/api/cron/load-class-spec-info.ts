import type { NextApiRequest, NextApiResponse } from "next/types";
import loadClassSpecInfo from "~/server/api/loadClassSpecInfo";

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  await loadClassSpecInfo();
  response.status(200);
  response.end();
}
