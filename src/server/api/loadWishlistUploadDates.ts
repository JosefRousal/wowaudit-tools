import { prisma } from "~/server/db";
import { type Difficulty } from "~/types";
import getWishlists from "~/wowaudit/characters/get-wishlists";

const difficulties: Difficulty[] = ["normal", "heroic", "mythic"];
const wishlistName = "Single Target - Max Upgrades";

export default async function loadWishlistUploadDates() {
  const characters = await prisma.character.findMany({
    include: {
      class: {
        include: {
          specializations: true,
        },
      },
    },
  });

  const data = await getWishlists();

  for (const character of characters) {
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
          const specUploadInfo = uploadDateInfo[specialization.name];

          if (!specUploadInfo) continue;

          switch (difficulty) {
            case "normal":
              await prisma.wishlistUploadInfo.upsert({
                where: {
                  characterId_specializationId: {
                    characterId: character.id,
                    specializationId: specialization.id,
                  },
                },
                create: {
                  characterId: character.id,
                  specializationId: specialization.id,
                  normal: specUploadInfo,
                },
                update: {
                  normal: specUploadInfo,
                },
              });
              break;
            case "heroic":
              await prisma.wishlistUploadInfo.upsert({
                where: {
                  characterId_specializationId: {
                    characterId: character.id,
                    specializationId: specialization.id,
                  },
                },
                create: {
                  characterId: character.id,
                  specializationId: specialization.id,
                  heroic: specUploadInfo,
                },
                update: {
                  heroic: specUploadInfo,
                },
              });
              break;
            case "mythic":
              await prisma.wishlistUploadInfo.upsert({
                where: {
                  characterId_specializationId: {
                    characterId: character.id,
                    specializationId: specialization.id,
                  },
                },
                create: {
                  characterId: character.id,
                  specializationId: specialization.id,
                  mythic: specUploadInfo,
                },
                update: {
                  mythic: specUploadInfo,
                },
              });
              break;
          }
        }
      }
    }
  }
  await prisma.syncHistory.upsert({
    where: {
      reportName: "wishlist-upload-dates",
    },
    create: {
      reportName: "wishlist-upload-dates",
      timestamp: new Date(),
    },
    update: {
      timestamp: new Date(),
    },
  });
}
