import getSpecTierSims from "~/bloodmallet/get-spec-tier-sims";
import { prisma } from "~/server/db";

export default async function handler() {
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
    const t30 = simData.data.T30;
    if (!t30) continue;
    const twoPiece = t30.twoPiece;
    const fourPiece = t30.fourPiece;
    const noTier = t30.noTier;
    await prisma.tierDpsSimData.upsert({
      where: {
        specializationId: specialization.id,
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
  await prisma.syncHistory.upsert({
    where: {
      reportName: "tier-sim-data",
    },
    create: {
      reportName: "tier-sim-data",
      timestamp: new Date(),
    },
    update: {
      timestamp: new Date(),
    },
  });
}
