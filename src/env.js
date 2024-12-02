import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CHROME_EXECUTABLE_PATH: z.string().optional(),
    AUTH_RESEND_KEY: z.string(),
    AUTH_RESEND_FROM: z.string(),
    LINKEDIN_USERNAME: z.string(),
    LINKEDIN_JSESSIONID: z.string(),
    LINKEDIN_LI_AT: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    UPLOADTHING_SECRET: z.string(),

    STRIPE_API_KEY: z.string(),
    STRIPE_API_SECRET: z.string(),

    STRIPE_WEBHOOK_SECRET: z.string(),
    BACKEND_URL: z.string(),
  },


  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_APP_URL: z.string(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),

    NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY: z.string(),
    NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY: z.string(),
    NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY: z.string(),
    NEXT_PUBLIC_STRIPE_GROWTH_YEARLY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CHROME_EXECUTABLE_PATH: process.env.CHROME_EXECUTABLE_PATH,
    AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
    AUTH_RESEND_FROM: process.env.AUTH_RESEND_FROM,
    LINKEDIN_USERNAME: process.env.LINKEDIN_USERNAME,
    LINKEDIN_JSESSIONID: process.env.LINKEDIN_JSESSIONID,
    LINKEDIN_LI_AT: process.env.LINKEDIN_LI_AT,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,

    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_API_SECRET: process.env.STRIPE_API_SECRET,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    BACKEND_URL: process.env.BACKEND_URL,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY,
    NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY,
    NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY,
    NEXT_PUBLIC_STRIPE_GROWTH_YEARLY: process.env.NEXT_PUBLIC_STRIPE_GROWTH_YEARLY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
