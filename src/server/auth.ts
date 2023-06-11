import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";
import { env } from "~/env.mjs";
import db from "./drizzle/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          name: token.name,
        },
      };
    },
    async signIn({ user }) {
      const allowedIds = await db.query.allowedUsers.findMany();
      if (!user.name) return false;
      return !!allowedIds.find((x) => x.name === user.name?.toLowerCase());
    },
  },
  providers: [
    BattleNetProvider({
      clientId: env.BATTLENET_CLIENT_ID,
      clientSecret: env.BATTLENET_CLIENT_SECRET,
      issuer: env.BATTLENET_ISSUER,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
