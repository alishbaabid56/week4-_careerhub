import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { employerProfiles, users } from "@/db/schema";

const profileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(150, "Company name must be less than 150 characters."),

  logoUrl: z
    .string()
    .trim()
    .url("Please enter a valid logo URL.")
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters."),

  website: z
    .string()
    .trim()
    .url("Please enter a valid website URL.")
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .max(150, "Location must be less than 150 characters."),
});

async function getEmployerSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return null;
  }

  const user = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (
    user.length === 0 ||
    user[0].role !== "employer" ||
    !user[0].isActive
  ) {
    return null;
  }

  return user[0];
}

export async function GET(request: Request) {
  try {
    const user = await getEmployerSession(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const profile = await db
      .select({
        id: employerProfiles.id,
        companyName: employerProfiles.companyName,
        logoUrl: employerProfiles.logoUrl,
        description: employerProfiles.description,
        website: employerProfiles.website,
        location: employerProfiles.location,
      })
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      profile: profile[0] ?? null,
    });
  } catch (error) {
    console.error("Employer profile GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load employer profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getEmployerSession(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = profileSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return NextResponse.json(
        {
          success: false,
          message: firstError?.message || "Invalid profile information.",
        },
        { status: 400 }
      );
    }

    const { companyName, logoUrl, description, website, location } =
      result.data;

    const existingProfile = await db
      .select({
        id: employerProfiles.id,
      })
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, user.id))
      .limit(1);

    if (existingProfile.length > 0) {
      await db
        .update(employerProfiles)
        .set({
          companyName,
          logoUrl: logoUrl || null,
          description: description || null,
          website: website || null,
          location: location || null,
          updatedAt: new Date(),
        })
        .where(eq(employerProfiles.userId, user.id));
    } else {
      await db.insert(employerProfiles).values({
        userId: user.id,
        companyName,
        logoUrl: logoUrl || null,
        description: description || null,
        website: website || null,
        location: location || null,
      });
    }

    const updatedProfile = await db
      .select({
        id: employerProfiles.id,
        companyName: employerProfiles.companyName,
        logoUrl: employerProfiles.logoUrl,
        description: employerProfiles.description,
        website: employerProfiles.website,
        location: employerProfiles.location,
      })
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "Company profile saved successfully.",
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Employer profile PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save employer profile.",
      },
      { status: 500 }
    );
  }
}