import { type Difficulty } from "~/types";
import wowAuditApi from "~/wowaudit/wowAuditApi";
import db from "../drizzle/db";
import {
  characters,
  classes,
  specializations,
  wishlistUploads,
  syncHistory,
} from "~/server/drizzle/schema";
import { and, eq } from "drizzle-orm";
import upsert from "../drizzle/upsert";

const difficulties: Difficulty[] = ["normal", "heroic", "mythic"];
const wishlistName = "Single Target - Max Upgrades";

const getCharacterData = async () => {
  const characterDbData = await db
    .select({
      id: characters.id,
      name: characters.name,
      classId: classes.id,
      className: classes.name,
      specializationId: specializations.id,
      specializationName: specializations.name,
    })
    .from(characters)
    .innerJoin(classes, eq(characters.classId, classes.id))
    .innerJoin(specializations, eq(classes.id, specializations.classId));

  const characterData: {
    id: number;
    name: string;
    class: {
      id: number;
      name: string;
      specializations: {
        id: number;
        name: string;
      }[];
    };
  }[] = [];

  for (const dbCharacter of characterDbData) {
    const existing = characterData.find((x) => x.id === dbCharacter.id);
    if (existing) {
      const existingSpec = existing.class.specializations.find(
        (x) => x.id === dbCharacter.specializationId
      );
      if (!existingSpec) {
        existing.class.specializations.push({
          id: dbCharacter.specializationId,
          name: dbCharacter.specializationName,
        });
      }
    } else {
      characterData.push({
        id: dbCharacter.id,
        name: dbCharacter.name,
        class: {
          id: dbCharacter.classId,
          name: dbCharacter.className,
          specializations: [
            {
              id: dbCharacter.specializationId,
              name: dbCharacter.specializationName,
            },
          ],
        },
      });
    }
  }
  return characterData;
};

const upsertSyncHistory = async (
  characterId: number,
  specializationId: number,
  difficulty: Difficulty,
  value: Date
) => {
  await upsert({
    table: wishlistUploads,
    match: and(
      eq(wishlistUploads.characterId, characterId),
      eq(wishlistUploads.specializationId, specializationId)
    ),
    insert: {
      characterId,
      specializationId,
      [difficulty]: value,
    },
    update: {
      [difficulty]: value,
    },
  });
};

const updateSyncHistory = async () => {
  const reportName = "wishlist-upload-dates";
  await upsert({
    table: syncHistory,
    match: eq(syncHistory.reportName, reportName),
    insert: {
      reportName: reportName,
      timestamp: new Date(),
    },
    update: {
      timestamp: new Date(),
    },
  });
};

export default async function loadWishlistUploadDates() {
  const characterData = await getCharacterData();

  const response = await wowAuditApi.getWishlists();
  const data = response.characters;


  for (const character of characterData) {
    const wishlistCharacter = data.find((x) => x.name === character.name);
    if (!wishlistCharacter) continue;
    const currentTierInfo = wishlistCharacter.wishlists
      .find((x) => x.name === wishlistName)
      ?.instances.find((x) => x.id === 17);
    for (const specialization of character.class.specializations) {
      for (const difficulty of difficulties) {
        const difficultyInfo = currentTierInfo?.difficulties.find(
          (x) => x.difficulty === difficulty
        );
        if (!difficultyInfo) return;
        const uploadDateInfo =
          difficultyInfo.wishlist.wishlist.report_uploaded_at;
        if (uploadDateInfo) {
          const uploadDate = uploadDateInfo[specialization.name];

          if (!uploadDate) continue;

          await upsertSyncHistory(
            character.id,
            specialization.id,
            difficulty,
            uploadDate
          );
        }
      }
    }
  }
  await updateSyncHistory();
}
