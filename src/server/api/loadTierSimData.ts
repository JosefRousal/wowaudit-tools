import { and, eq } from "drizzle-orm";
import db from "../drizzle/db";
import classes from "../drizzle/schema/classes";
import specializations from "../drizzle/schema/specializations";
import getSpecTierSims from "~/bloodmallet/get-spec-tier-sims";
import upsert from "../drizzle/upsert";
import tierDpsSims from "../drizzle/schema/tierDpsSims";
import syncHistory from "../drizzle/schema/syncHistory";

const updateSyncHistory = async () => {
  const reportName = "tier-sim-data";
  await upsert({
    table: syncHistory,
    match: eq(syncHistory.reportName, reportName),
    insert: {
      reportName,
      timestamp: new Date(),
    },
    update: {
      timestamp: new Date(),
    },
  });
};

const loadTierSimData = async () => {
  const specializationData = await db
    .select({
      id: specializations.id,
      name: specializations.name,
      className: classes.name,
    })
    .from(specializations)
    .innerJoin(classes, eq(classes.id, specializations.classId));

  for (const specialization of specializationData) {
    const className = specialization.className
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
    await upsert({
      table: tierDpsSims,
      match: and(
        eq(tierDpsSims.specializationId, specialization.id),
        eq(tierDpsSims.tier, 30)
      ),
      insert: {
        specializationId: specialization.id,
        tier: 30,
        twoPiece: twoPiece.toString(),
        fourPiece: fourPiece.toString(),
        noTier: noTier.toString(),
      },
      update: {
        twoPiece: twoPiece.toString(),
        fourPiece: fourPiece.toString(),
        noTier: noTier.toString(),
      },
    });
  }
  await updateSyncHistory();
};

export default loadTierSimData;
