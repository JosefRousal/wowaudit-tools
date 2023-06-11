import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import classes from "./classes";

export default pgTable("characters", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
  guildRank: integer("guildRank").notNull(),
  classId: integer("classId")
    .notNull()
    .references(() => classes.id),
});
