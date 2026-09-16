import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    
  }),

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: ["candidate", "employer", "admin"],
        required: false,
        defaultValue: "candidate",
        input: false,
        returned: true,
      },

      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
        returned: true,
      },
    },
  },
});