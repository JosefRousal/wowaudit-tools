import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import classes from "./classes";

export default pgTable("specializations", {
  id: integer("id").primaryKey(),
  classId: integer("classId")
    .notNull()
    .references(() => classes.id),
  name: varchar("name").notNull(),
});
