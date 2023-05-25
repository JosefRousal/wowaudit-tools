/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";

export const tierSimsRouter = createTRPCRouter({
  allTierSims: publicProcedure.query(async () => {
    const data = await prisma.tierDpsSimData.findMany({
      include: {
        class: true,
        specialization: true,
      },
    });
    const results: {
      className: string;
      spec: string;
      twoPiece?: number;
      fourPiece?: number;
      noTier?: number;
      noVsTwo?: number;
      noVsFour?: number;
      twoVsFour?: number;
    }[] = [];
    for (const row of data) {
      const twoPiece = row.twoPiece.toNumber();
      const fourPiece = row.fourPiece.toNumber();
      const noTier = row.noTier.toNumber();
      results.push({
        className: row.class.name,
        spec: row.specialization.name,
        twoPiece: twoPiece,
        fourPiece: fourPiece,
        noTier: noTier,
        noVsTwo: twoPiece && noTier && (twoPiece - noTier) / noTier,
        noVsFour: fourPiece && noTier && (fourPiece - noTier) / noTier,
        twoVsFour: twoPiece && fourPiece && (fourPiece - twoPiece) / twoPiece,
      });
    }
    return results;
  }),
});
