import { integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import characters from "./characters";
import specializations from "./specializations";

export default pgTable(
  "wishlist_uploads",
  {
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id),
    specializationId: integer("specialization_id")
      .notNull()
      .references(() => specializations.id),
    normal: timestamp("normal"),
    heroic: timestamp("heroic"),
    mythic: timestamp("mythic"),
  },
  (table) => ({
    cpk: primaryKey(table.characterId, table.specializationId),
  })
);
