/*

  
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
  */

import { wow } from "blizzard.js";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  PlayableClassIndexResponseSchema,
  PlayableClassResponseSchema,
} from "~/battlenet/types";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
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
  for (const playableClass of classes) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await prisma.class.upsert({
      where: { id: playableClass.id },
      update: { name: playableClass.name },
      create: {
        id: playableClass.id,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await prisma.specialization.upsert({
        where: { id: specialization.id },
        update: {
          name: specialization.name,
          classId: playableClass.id,
        },
        create: {
          id: specialization.id,
          name: specialization.name,
          classId: playableClass.id,
        },
      });
    }
  }
}