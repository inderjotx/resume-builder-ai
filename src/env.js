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
    STRIPE_API_KEY: z.string(),
    STRIPE_API_SECRET: z.string(),
    LINKEDIN_USERNAME: z.string(),
    LINKEDIN_JSESSIONID: z.string(),
    LINKEDIN_LI_AT: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    UPLOADTHING_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
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
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_API_SECRET: process.env.STRIPE_API_SECRET,
    LINKEDIN_USERNAME: process.env.LINKEDIN_USERNAME,
    LINKEDIN_JSESSIONID: process.env.LINKEDIN_JSESSIONID,
    LINKEDIN_LI_AT: process.env.LINKEDIN_LI_AT,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
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
