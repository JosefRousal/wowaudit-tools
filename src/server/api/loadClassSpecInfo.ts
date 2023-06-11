import { wow } from "blizzard.js";
import {
  PlayableClassIndexResponseSchema,
  PlayableClassResponseSchema,
} from "~/battlenet/types";
import { env } from "~/env.mjs";
import upsert from "../drizzle/upsert";
import { eq } from "drizzle-orm";
import { classes, specializations } from "~/server/drizzle/schema";

export default async function loadClassSpecInfo() {
  const wowClient = await wow.createInstance({
    key: env.BATTLENET_CLIENT_ID,
    secret: env.BATTLENET_CLIENT_SECRET,
    origin: "us",
    locale: "en_US",
    token: "",
  });
  const classResponse = await wowClient.playableClass();
  if (classResponse.status !== 200) return null;
  const classData = PlayableClassIndexResponseSchema.parse(classResponse.data);
  for (const playableClass of classData) {
    await upsert({
      table: classes,
      match: eq(classes.id, playableClass.id),
      insert: {
        id: playableClass.id,
        name: playableClass.name,
      },
      update: {
        name: playableClass.name,
      },
    });

    const singleClassResponse = await wowClient.playableClass({
      id: playableClass.id,
    });
    if (classResponse.status !== 200) continue;
    const singleClass = PlayableClassResponseSchema.parse(
      singleClassResponse.data
    );
    for (const specialization of singleClass.specializations) {
      await upsert({
        table: specializations,
        match: eq(specializations.id, specialization.id),
        insert: {
          id: specialization.id,
          name: specialization.name,
          classId: playableClass.id,
        },
        update: {
          name: specialization.name,
          classId: playableClass.id,
        },
      });
    }
  }
}
