import { type Config } from "drizzle-kit";
import { env } from "@/env";


export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: true,
  },
  out: "./drizzle",
  tablesFilter: ["resume-builder_*"],
} satisfies Config;
