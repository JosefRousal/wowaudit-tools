import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    WOWAUDIT_URL: z
      .string()
      .url()
      .transform((value) => new URL(value)),
    WOWAUDIT_KEY: z.string(),
    BATTLENET_CLIENT_ID: z.string(),
    BATTLENET_CLIENT_SECRET: z.string(),
    BATTLENET_ISSUER: z.enum([
      "https://www.battlenet.com.cn/oauth",
      "https://us.battle.net/oauth",
      "https://eu.battle.net/oauth",
      "https://kr.battle.net/oauth",
      "https://tw.battle.net/oauth",
    ]),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    WOWAUDIT_URL: process.env.WOWAUDIT_URL,
    WOWAUDIT_KEY: process.env.WOWAUDIT_KEY,
    BATTLENET_CLIENT_ID: process.env.BATTLENET_CLIENT_ID,
    BATTLENET_CLIENT_SECRET: process.env.BATTLENET_CLIENT_SECRET,
    BATTLENET_ISSUER: process.env.BATTLENET_ISSUER,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
});
