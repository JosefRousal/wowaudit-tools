import type { NextApiRequest, NextApiResponse } from "next/types";
import loadWishlistUploadDates from "~/server/api/loadWishlistUploadDates";

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  await loadWishlistUploadDates();
  response.status(200);
  response.end();
}
