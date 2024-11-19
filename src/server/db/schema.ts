import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `resume-builder_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  // nextauth setup required
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),

  // custom fields - all optional
  onboardingDone: boolean("onboarding_done").default(false),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).default(""),

  // Additional general information that's common across all resumes
  firstName: varchar("first_name", { length: 255 }).default(""),
  lastName: varchar("last_name", { length: 255 }).default(""),
  phoneNumber: varchar("phone_number", { length: 20 }).default(""),
  location: varchar("location", { length: 255 }).default(""),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  nationality: varchar("nationality", { length: 255 }).default(""),
  address: varchar("address", { length: 255 }).default(""),
  city: varchar("city", { length: 255 }).default(""),
  postalCode: varchar("postal_code", { length: 255 }).default(""),
  country: varchar("country", { length: 255 }).default(""),
  website: varchar("website", { length: 200 }).default(""),
  bio: text("bio").default(""),
});



export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  subscriptions: many(subscriptions),
  resume: many(resume),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const status = pgEnum("status", [
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "trialing",
  "unpaid",
]);

export const subscriptions = createTable(
  "subscription",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    status: status("status").notNull(),
    subscriptionId: varchar("subscription_id", { length: 255 }).notNull(),
    priceId: varchar("price_id", { length: 255 }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    cancelAt: timestamp("cancel_at", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (subscription) => ({
    userIdIdx: index("subscription_user_id_idx").on(subscription.userId),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

// Define TypeScript types for the resume data
type ResumeData = {
  workExperience: Array<{
    id: string;
    iconId?: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    city?: string;
    country?: string;
  }>;
  education: Array<{
    id: string;
    iconId?: string;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    city: string;
    isCurrentlyStudying: boolean;
    description: string;
  }>;
  skills: Array<{
    id: string;
    iconId?: string;
    skillCategory: string;
    skillTags: string[];
  }>;
  achievements: Array<{
    id: string;
    iconId?: string;
    achievementTitle: string;
    achievementDate: string;
    achievementDescription: string;
  }>;
  awards: Array<{
    id: string;
    iconId?: string;
    title: string;
    date: string;
    url?: string;
    issuer: string;
    description: string;
  }>;
  references: Array<{
    id: string;
    iconId?: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phoneNumber: string;
    relationship: string;
  }>;
  publications: Array<{
    id: string;
    iconId?: string;
    title: string;
    date: string;
    url?: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    iconId?: string;
    projectName: string;
    description: string;
    projectLink?: string;
    city?: string;
    country?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
  socialMedia: Array<{
    id: string;
    iconId?: string;
    platform: string;
    url: string;
  }>;
  customSections: Array<{
    id: string;
    title: string;
    content: unknown;
  }>;
  metadata: {
    lastUpdated: string;
    version: string;
    template?: string;
    style?: {
      theme: string;
      font: string;
      colors: Record<string, string>;
    };
  };
};

// Update the resume table with JSONB
export const resume = createTable("resume", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).default("Untitled Resume"),
  isPublic: boolean("is_public").default(false),
  data: jsonb("data").$type<ResumeData>().default('{}' as unknown as ResumeData),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Keep the relations
export const resumeRelations = relations(resume, ({ one }) => ({
  user: one(users, { fields: [resume.userId], references: [users.id] }),
}));



export const goals = createTable("goals", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  goal: text("goal").default(""),
  iconId: varchar("icon_id", { length: 255 }).default(""),
});



export const graphs = createTable("graphs", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  iconId: varchar("icon_id", { length: 255 }).default(""),
  graphType: varchar("graph_type", { length: 255 }).default(""),
  graphData: jsonb("graph_data").default("{}"),
});



export const projects = createTable("projects", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  iconId: varchar("icon_id", { length: 255 }).default(""),
  projectName: varchar("project_name", { length: 255 }).default(""),
  description: text("description").default(""),
  projectLink: varchar("project_link", { length: 255 }).default(""),
  city: varchar("city", { length: 255 }).default(""),
  country: varchar("country", { length: 255 }).default(""),
  startDate: timestamp("start_date", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  endDate: timestamp("end_date", { withTimezone: true }),
  isCurrent: boolean("is_current").default(false),

});



export const languages = createTable("languages", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  language: varchar("language", { length: 255 }).default(""),
  proficiency: varchar("proficiency", { length: 255 }).default(""),
});


export const socialMedia = createTable("social_media", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  iconId: varchar("icon_id", { length: 255 }).default(""),
  platform: varchar("platform", { length: 255 }).default(""),
  url: varchar("url", { length: 255 }).default(""),
});