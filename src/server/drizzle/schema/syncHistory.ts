import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export default pgTable("sync_history", {
  reportName: varchar("report_name").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
});
