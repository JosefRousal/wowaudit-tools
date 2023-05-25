import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { wow } from "blizzard.js";
import {
  PlayableClassIndexResponseSchema,
  PlayableClassResponseSchema,
} from "~/battlenet/types";
import getSpecTierSims from "~/bloodmallet/get-spec-tier-sims";

const getClassSpecMap = async () => {
  const wowClient = await wow.createInstance({
    key: env.BATTLENET_CLIENT_ID,
    secret: env.BATTLENET_CLIENT_SECRET,
    origin: "us",
    locale: "en_US",
    token: "",
  });
  const classResponse = await wowClient.playableClass();
  if (classResponse.status !== 200) return null;
  const classes = PlayableClassIndexResponseSchema.parse(classResponse.data);
  const result: { className: string; specName: string }[] = [];
  for (const playableClass of classes) {
    const singleClassResponse = await wowClient.playableClass({
      id: playableClass.id,
    });
    if (classResponse.status !== 200) continue;
    const singleClass = PlayableClassResponseSchema.parse(
      singleClassResponse.data
    );
    for (const specialization of singleClass.specializations) {
      result.push({
        className: singleClass.name,
        specName: specialization.name,
      });
    }
  }
  return result;
};

export const tierSimsRouter = createTRPCRouter({
  allTierSims: publicProcedure.query(async () => {
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
    const classSpecMap = await getClassSpecMap();
    if (!classSpecMap) return null;
    for (const classSpec of classSpecMap) {
      const simData = await getSpecTierSims(
        classSpec.className.toLocaleLowerCase().replaceAll(" ", "_"),
        classSpec.specName.toLocaleLowerCase().replaceAll(" ", "_")
      );
      if (!simData) continue;
      const twoPiece = simData?.data.T30.twoPiece;
      const fourPiece = simData?.data.T30.fourPiece;
      const noTier = simData?.data.T30.noTier;
      results.push({
        className: classSpec.className,
        spec: classSpec.specName,
        twoPiece,
        fourPiece,
        noTier,
        noVsTwo: twoPiece && noTier && ((twoPiece - noTier) / noTier),
        noVsFour: fourPiece && noTier && ((fourPiece - noTier) / noTier),
        twoVsFour:
          twoPiece && fourPiece && ((fourPiece - twoPiece) / twoPiece),
      });
    }
    return results;
  }),
});
