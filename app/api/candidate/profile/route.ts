import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { candidateProfiles } from "@/db/schema";

const profileSchema = z.object({
  bio: z.string().trim().max(1000).optional(),
  skills: z.string().trim().max(1000).optional(),
  education: z.string().trim().max(1000).optional(),
  experience: z.string().trim().max(2000).optional(),
  resumeUrl: z.string().trim().url().optional().or(z.literal("")),
  photoUrl: z.string().trim().url().optional().or(z.literal("")),
});

async function getCandidateSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const user = session.user as typeof session.user & {
    role?: string;
  };

  if (user.role !== "candidate") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session = await getCandidateSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const profile = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      profile: profile[0] ?? null,
    });
  } catch (error) {
    console.error("Candidate profile GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCandidateSession();

    if (!session) {
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
      return NextResponse.json(
        {
          success: false,
          message: "Please provide valid profile information.",
        },
        { status: 400 }
      );
    }

    const existingProfile = await db
      .select({ id: candidateProfiles.id })
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, session.user.id))
      .limit(1);

    const profileData = {
      bio: result.data.bio || null,
      skills: result.data.skills || null,
      education: result.data.education || null,
      experience: result.data.experience || null,
      resumeUrl: result.data.resumeUrl || null,
      photoUrl: result.data.photoUrl || null,
      updatedAt: new Date(),
    };

    if (existingProfile.length > 0) {
      await db
        .update(candidateProfiles)
        .set(profileData)
        .where(eq(candidateProfiles.userId, session.user.id));
    } else {
      await db.insert(candidateProfiles).values({
        userId: session.user.id,
        ...profileData,
      });
    }

    const updatedProfile = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully.",
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Candidate profile PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save your profile.",
      },
      { status: 500 }
    );
  }
}