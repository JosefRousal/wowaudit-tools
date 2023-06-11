import type { SQL } from "drizzle-orm";
import type {
  AnyPgTable,
  PgInsertValue,
  PgUpdateSetSource,
} from "drizzle-orm/pg-core";
import db from "./db";

export default async function upsert<TTable extends AnyPgTable>(upsertConfig: {
  table: TTable;
  match: SQL | undefined;
  insert: PgInsertValue<TTable>;
  update: PgUpdateSetSource<TTable>;
}) {
  const existing = await db
    .select({})
    .from(upsertConfig.table)
    .where(upsertConfig.match);
  if (existing.length !== 0) {
    await db
      .update(upsertConfig.table)
      .set(upsertConfig.update)
      .where(upsertConfig.match);
  } else {
    await db.insert(upsertConfig.table).values(upsertConfig.insert);
  }
}
