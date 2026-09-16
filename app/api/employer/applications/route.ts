
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { applications, jobs, users, candidateProfiles } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getEmployer(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return null;
  }

  const employer = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (
    employer.length === 0 ||
    employer[0].role !== "employer" ||
    !employer[0].isActive
  ) {
    return null;
  }

  return employer[0];
}

export async function GET(request: Request) {
  try {
    const employer = await getEmployer(request);

    if (!employer) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const result = await db
      .select({
        id: applications.id,
        jobId: applications.jobId,
        candidateId: applications.candidateId,
        coverLetter: applications.coverLetter,
        resumeUrl: applications.resumeUrl,
        status: applications.status,
        appliedAt: applications.appliedAt,
        updatedAt: applications.updatedAt,

        jobTitle: jobs.title,
        companyName: jobs.companyName,

        candidateName: users.name,
        candidateEmail: users.email,

        profileBio: candidateProfiles.bio,
        profileSkills: candidateProfiles.skills,
        profileEducation: candidateProfiles.education,
        profileExperience: candidateProfiles.experience,
        profileResumeUrl: candidateProfiles.resumeUrl,
        profilePhotoUrl: candidateProfiles.photoUrl,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(users, eq(applications.candidateId, users.id))
      .leftJoin(
        candidateProfiles,
        eq(candidateProfiles.userId, users.id)
      )
      .where(eq(jobs.employerId, employer.id))
      .orderBy(desc(applications.appliedAt));

    return NextResponse.json({
      success: true,
      applications: result,
    });
  } catch (error) {
    console.error("Employer applications GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load applications.",
      },
      { status: 500 }
    );
  }
}

