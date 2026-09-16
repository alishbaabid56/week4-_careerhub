import {
  boolean,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "candidate",
  "employer",
  "admin",
]);

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "internship",
  "contract",
  "remote",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "approved",
  "rejected",
  "closed",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "under_review",
  "shortlisted",
  "interview",
  "accepted",
  "rejected",
]);

// ─────────────────────────────────────────────
// USERS — Better Auth user table
// ─────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    email: text("email").notNull().unique(),

    emailVerified: boolean("email_verified")
      .notNull()
      .default(false),

    image: text("image"),

    role: userRoleEnum("role")
      .notNull()
      .default("candidate"),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("users_role_idx").on(table.role),
    index("users_active_idx").on(table.isActive),
  ],
);

// ─────────────────────────────────────────────
// BETTER AUTH — SESSIONS
// ─────────────────────────────────────────────

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    token: text("token").notNull().unique(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("sessions_user_idx").on(table.userId),
    index("sessions_expires_idx").on(table.expiresAt),
  ],
);

// ─────────────────────────────────────────────
// BETTER AUTH — ACCOUNTS
// ─────────────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    accountId: text("account_id").notNull(),

    providerId: text("provider_id").notNull(),

    accessToken: text("access_token"),

    refreshToken: text("refresh_token"),

    accessTokenExpiresAt: timestamp(
      "access_token_expires_at",
      {
        withTimezone: true,
      },
    ),

    refreshTokenExpiresAt: timestamp(
      "refresh_token_expires_at",
      {
        withTimezone: true,
      },
    ),

    scope: text("scope"),

    idToken: text("id_token"),

    password: text("password"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("accounts_user_idx").on(table.userId),

    unique("accounts_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

// ─────────────────────────────────────────────
// BETTER AUTH — VERIFICATIONS
// ─────────────────────────────────────────────

export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    identifier: text("identifier").notNull(),

    value: text("value").notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("verifications_identifier_idx").on(
      table.identifier,
    ),

    index("verifications_expires_idx").on(
      table.expiresAt,
    ),
  ],
);

// ─────────────────────────────────────────────
// CANDIDATE PROFILES
// ─────────────────────────────────────────────

export const candidateProfiles = pgTable(
  "candidate_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .unique(),

    photoUrl: text("photo_url"),

    bio: text("bio"),

    skills: text("skills"),

    education: text("education"),

    experience: text("experience"),

    resumeUrl: text("resume_url"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("candidate_profiles_user_idx").on(table.userId),
  ],
);

// ─────────────────────────────────────────────
// EMPLOYER PROFILES
// ─────────────────────────────────────────────

export const employerProfiles = pgTable(
  "employer_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .unique(),

    companyName: text("company_name").notNull(),

    logoUrl: text("logo_url"),

    description: text("description"),

    website: text("website"),

    location: text("location"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("employer_profiles_user_idx").on(table.userId),

    index("employer_profiles_company_idx").on(
      table.companyName,
    ),
  ],
);

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull().unique(),

    description: text("description"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("categories_name_idx").on(table.name),
  ],
);

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    employerId: uuid("employer_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    categoryId: uuid("category_id").references(
      () => categories.id,
      {
        onDelete: "set null",
      },
    ),

    title: text("title").notNull(),

    description: text("description").notNull(),

    companyName: text("company_name").notNull(),

    location: text("location").notNull(),

    jobType: jobTypeEnum("job_type").notNull(),

    salary: text("salary"),

    requirements: text("requirements"),

    deadline: date("deadline"),

    status: jobStatusEnum("status")
      .notNull()
      .default("pending"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("jobs_employer_idx").on(table.employerId),
    index("jobs_category_idx").on(table.categoryId),
    index("jobs_status_idx").on(table.status),
    index("jobs_type_idx").on(table.jobType),
    index("jobs_location_idx").on(table.location),
    index("jobs_deadline_idx").on(table.deadline),
  ],
);

// ─────────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────────

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, {
        onDelete: "cascade",
      }),

    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    coverLetter: text("cover_letter"),

    resumeUrl: text("resume_url"),

    status: applicationStatusEnum("status")
      .notNull()
      .default("applied"),

    appliedAt: timestamp("applied_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("applications_job_candidate_unique").on(
      table.jobId,
      table.candidateId,
    ),

    index("applications_job_idx").on(table.jobId),

    index("applications_candidate_idx").on(
      table.candidateId,
    ),

    index("applications_status_idx").on(table.status),
  ],
);