import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const classes = pgTable("classes", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const classSpecializationsRelation = relations(classes, ({ many }) => ({
  specializations: many(specializations),
}));

export const classCharactersRelation = relations(classes, ({ many }) => ({
  characters: many(characters),
}));

export const specializations = pgTable("specializations", {
  id: integer("id").primaryKey(),
  classId: integer("classId")
    .notNull()
    .references(() => classes.id),
  name: varchar("name").notNull(),
});

export const classesRelation = relations(specializations, ({ one }) => ({
  class: one(classes),
}));

export const characters = pgTable("characters", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
  guildRank: integer("guildRank").notNull(),
  classId: integer("classId")
    .notNull()
    .references(() => classes.id),
});

export const characterClassRelation = relations(characters, ({ one }) => ({
  class: one(classes),
}));

export const syncHistory = pgTable("sync_history", {
  reportName: varchar("report_name").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
});

export const wishlistUploads = pgTable(
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

export const allowedUsers = pgTable("allowed_users", {
  name: varchar("name").primaryKey(),
});
