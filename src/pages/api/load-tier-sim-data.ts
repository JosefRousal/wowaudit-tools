import type { NextApiRequest, NextApiResponse } from "next";
import getSpecTierSims from "~/bloodmallet/get-spec-tier-sims";
import { prisma } from "~/server/db";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const classes = await prisma.class.findMany({
    include: {
      specializations: true,
    },
  });

  for (const classItem of classes) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const className = classItem.name.toLocaleLowerCase().replaceAll(" ", "_");
    for (const spec of classItem.specializations) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const specName = spec.name.toLocaleLowerCase().replaceAll(" ", "_");
      const simData = await getSpecTierSims(className, specName);
      if (!simData) continue;
      const twoPiece = simData?.data.T30.twoPiece;
      const fourPiece = simData?.data.T30.fourPiece;
      const noTier = simData?.data.T30.noTier;
      await prisma.tierDpsSimData.upsert({
        where: {
          classId_specializationId: {
            classId: classItem.id,
            specializationId: spec.id,
          },
        },
        create: {
          classId: classItem.id,
          specializationId: spec.id,
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
}
