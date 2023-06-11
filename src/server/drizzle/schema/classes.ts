import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export default pgTable("classes", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
});
