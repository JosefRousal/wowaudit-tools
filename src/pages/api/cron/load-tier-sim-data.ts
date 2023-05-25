/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import getSpecTierSims from "~/bloodmallet/get-spec-tier-sims";
import { prisma } from "~/server/db";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const specializations = await prisma.specialization.findMany({
    include: {
      class: true,
    },
  });

  for (const specialization of specializations) {
    const className = specialization.class.name
      .toLocaleLowerCase()
      .replaceAll(" ", "_");
    const specName = specialization.name
      .toLocaleLowerCase()
      .replaceAll(" ", "_");
    const simData = await getSpecTierSims(className, specName);
    if (!simData) continue;
    const twoPiece = simData?.data.T30.twoPiece;
    const fourPiece = simData?.data.T30.fourPiece;
    const noTier = simData?.data.T30.noTier;
    await prisma.tierDpsSimData.upsert({
      where: {
        specializationId: specialization.id
      },
      create: {
        specializationId: specialization.id,
        twoPiece,
        fourPiece,
        noTier,
      },
      update: {
        twoPiece,
        fourPiece,
        noTier,
      },
    });
  }
}
