import { createTRPCRouter } from "~/server/api/trpc";
import { checkVaultRouter } from "./routers/check-vault";
import { wishlistRouter } from "./routers/wishlist";
import { charactersRouter } from "./routers/characters";
import { tierSimsRouter } from "./routers/tier-sims";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  characters: charactersRouter,
  checkVault: checkVaultRouter,
  wishlist: wishlistRouter,
  tierSims: tierSimsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
