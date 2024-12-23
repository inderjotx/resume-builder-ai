import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import type { User } from "@/server/db/schema";

import subscriptionService from "@/lib/subscription";
import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";

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
    } & DefaultSession["user"] & User;
  }
}


export const authConfig = {
  providers: [
    GoogleProvider,
    ResendProvider({
      from: env.AUTH_RESEND_FROM,
      apiKey: env.AUTH_RESEND_KEY,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    createUser: async ({ user }) => {

      if (!user.id || !user.email) {
        console.error("User ID or email is missing in the event >>>>>>>>>>>>>>>>>>>>");
        return;
      }
      await subscriptionService.createFreeSubscriptionMonthly(user.id!, user.email!);
    },
  },
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthConfig;
