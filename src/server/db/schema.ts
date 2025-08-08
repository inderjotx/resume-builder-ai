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

export const planType = pgEnum("plan_type", [
  "free",
  "growth",
  "professional",
]);


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
  userPlan: planType("user_plan").default("free"),
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
  credits: integer("credits").notNull().default(0),
});



export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  subscriptions: many(subscriptions),
  resume: many(resume),
  linkedInProfile: one(linkedInProfile, { fields: [users.id], references: [linkedInProfile.userId] })
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

export const subscriptionStatus = pgEnum("subscription_status", [
  "active",
  "canceled",
  "expired",
  "past_due",
]);


export const billingInterval = pgEnum("billing_interval", [
  "monthly",
  "yearly",
]);

export const creditTransactionType = pgEnum("credit_transaction_type", [
  "subscription_credit",
  "ai_resume_generation",
  "refund",
  "manual_adjustment",
  "credit_expiry",
]);

export const subscriptions = createTable(
  "subscription",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    stripePriceId: varchar("stripe_price_id", { length: 255 }).notNull(),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).notNull().unique(),
    status: subscriptionStatus("status").notNull(),
    plan: planType("plan").notNull(),
    interval: billingInterval("interval").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).defaultNow().notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    lastCreditRefresh: timestamp("last_credit_refresh", { withTimezone: true }).defaultNow().notNull(),
    nextCreditRefresh: timestamp("next_credit_refresh", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (subscription) => ({
    userIdIdx: index("subscription_user_id_idx").on(subscription.userId),
  })
);

export const creditLogs = createTable(
  "credit_log",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    amount: integer("amount").notNull(),
    type: creditTransactionType("type").notNull(),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (creditLog) => ({
    userIdIdx: index("credit_log_user_id_idx").on(creditLog.userId),
  })
);

export const creditLogsRelations = relations(creditLogs, ({ one }) => ({
  user: one(users, { fields: [creditLogs.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));




export enum Proficiency {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
  Native = "native"
}

export enum SocialMediaPlatform {
  LinkedIn = "linkedin",
  Twitter = "twitter",
  Facebook = "facebook",
  Instagram = "instagram",
  YouTube = "youtube",
  TikTok = "tiktok",
  Snapchat = "snapchat",
  Pinterest = "pinterest",
  Reddit = "reddit",
  Other = "other",
  Website = "website"
}


export type ResumeData = {
  personalInfo?: {
    iconId?: string;
    title?: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    location?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    website?: string;
    bio?: string;
  };
  workExperience?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      companyName?: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      description?: string;
      city?: string;
      country?: string;
    }>;
  };
  education?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      institutionName?: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      city?: string;
      isCurrentlyStudying?: boolean;
      description?: string;
      grade?: string;
    }>;
  };
  skills?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      skillCategory?: string;
      skillTags?: string[];
    }>;
  };
  achievements?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      achievementTitle?: string;
      achievementDate?: string;
      achievementDescription?: string;
    }>;
  };
  awards?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      title?: string;
      date?: string;
      url?: string;
      issuer?: string;
      description?: string;
    }>;
  };
  references?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      name?: string;
      position?: string;
      company?: string;
      email?: string;
      phoneNumber?: string;
      relationship?: string;
    }>;
  };
  publications?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      title?: string;
      date?: string;
      url?: string;
      description?: string;
    }>;
  };
  projects?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      projectName?: string;
      description?: string;
      projectLink?: string;
      city?: string;
      country?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
    }>;
  };
  languages?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      language?: string;
      proficiency?: Proficiency;
    }>;
  };
  socialMedia?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      platform?: SocialMediaPlatform;
      url?: string;
    }>;
  };
  goals?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      goal?: string;
    }>;
  };
  voluntaryWork?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      organizationName?: string;
      role?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      description?: string;
    }>;
  };
  certifications?: {
    iconId?: string;
    title?: string;
    items?: Array<{
      certificationName?: string;
      certificationDate?: string;
      certificationAuthority?: string;
      certificationLink?: string;
      description?: string;
    }>;
  };
};

export type SectionKeys = keyof ResumeData;


export enum ResumeStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export enum IconVariant {
  Solid = "solid",
  Outline = "outline",
}

export enum DateFormat {
  DayMonthYear = "DD/MM/YYYY",
  MonthDayYear = "MM/DD/YYYY",
  YearMonthDay = "YYYY/MM/DD",
}

export enum AddressFormat {
  CityCountry = "city, country",
  CountryCity = "country, city",
}

export enum PageSize {
  A4 = "A4",
  Letter = "letter",
}

export enum HeadlineCapitalization {
  AsTyped = "asTyped",
  Uppercase = "uppercase",
  Lowercase = "lowercase",
  Capitalize = "capitalize",
}

export enum IconType {
  Bold = "bold",
  Light = "light",
  Regular = "regular",
}

export enum PageNumber {
  NumbersShown = "numbersShown",
  NumbersHidden = "numbersHidden",
}

export type ResumeSettings = {
  color: string; // primary color
  secondaryColor?: string;
  accentColor?: string;
  format: number;
  fontFace: string;
  headingFontFace?: string;
  fontSize: string;
  lineHeight: string;
  headlineCapitalization: HeadlineCapitalization;
  iconType: IconType;
  iconVariant?: IconVariant;
  pageFormat: PageSize;
  pageNumber: PageNumber;
  dateFormat: DateFormat;
  templateId?: string;
  background: {
    className: string;
    opacity: number;
    color?: string;
  };
  addressFormat: {
    order: { id: SectionKeys, title: string }[]
    delimiter: string;
  };
};


export const resumeStatus = pgEnum("resume_status", [
  "draft",
  "published",
  "archived",
]);


export const DEFAULT_SECTIONS: { id: SectionKeys, title: string }[] = [{ id: 'personalInfo', title: "Personal Info" }, { id: 'workExperience', title: "Work Experience" }, { id: 'education', title: "Education" }, { id: 'skills', title: "Skills" }, { id: 'projects', title: "Projects" }];
export const DEFAULT_DATA: Partial<ResumeData> = {
  personalInfo: {
    title: "Personal Info",
  },
  workExperience: {
    title: "Work Experience",
    items: [],
  },
  education: {
    title: "Education",
    items: [],
  },
  skills: {
    title: "Skills",
    items: [],
  },
  projects: {
    title: "Projects",
    items: [],
  },
  achievements: {
    title: "Achievements",
    items: [],
  },
  awards: {
    title: "Awards",
    items: [],
  },
  goals: {
    title: "Goals",
    items: [],
  },
  references: {
    title: "References",
    items: [],
  },
  publications: {
    title: "Publications",
    items: [],
  },
  voluntaryWork: {
    title: "Voluntary Work",
    items: [],
  },
  certifications: {
    title: "Certifications",
    items: [],
  },
  languages: {
    title: "Languages",
    items: [],
  },
  socialMedia: {
    title: "Social Media",
    items: [],
  },
};


export const linkedInProfile = createTable("linkedin_profile", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id)
    .unique(),
  data: jsonb("data").$type<Partial<ResumeData>>().default(DEFAULT_DATA),
  linkedInId: varchar("linkedin_id", { length: 255 }).notNull(),
})


export const linkedInProfileRelations = relations(linkedInProfile, ({ one }) => ({
  user: one(users, { fields: [linkedInProfile.userId], references: [users.id] }),
}));

export const resume = createTable("resume", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).default("Untitled Resume"),
  isPublic: boolean("is_public").default(false),
  data: jsonb("data").$type<Partial<ResumeData>>().default(DEFAULT_DATA), // we can have some fields in the default values that we want to be default avaible   
  status: resumeStatus("status").default("draft"),

  thumbnail: varchar("thumbnail", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  order: jsonb("order").$type<{ id: SectionKeys, title: string }[]>().default(DEFAULT_SECTIONS),
  settings: jsonb("settings").$type<Partial<ResumeSettings>>().default({}),
});


interface ColorOptions {
  name: string,
  image: string,
}

interface FontOptions {
  fontFamily: string,
  fontWeight: string,
}


export const template = createTable("template", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  colorOptions: jsonb("color_options").$type<ColorOptions[]>().default([]),
  headlineCapitalization: boolean("headline_capitalization").default(false),
  fontOptions: jsonb("font_options").$type<FontOptions[]>().default([]),
  background: jsonb("background").$type<{
    className: string,
    opacity: number,
  }>().default({ className: "bg-white", opacity: 1 }),
});



export const resumeRelations = relations(resume, ({ one }) => ({
  user: one(users, { fields: [resume.userId], references: [users.id] }),
}));


export type Template = typeof template.$inferSelect;
export type Resume = typeof resume.$inferSelect;
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PlanType = typeof planType;
