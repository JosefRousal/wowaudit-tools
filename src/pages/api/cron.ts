import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  
  response.status(200).json({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}
