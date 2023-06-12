import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "~/env.mjs";
import * as schema from "./schema";

export default drizzle(
  new Pool({
    connectionString: env.DATABASE_URL,
  }),
  { schema, logger: true }
);
