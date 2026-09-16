
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { applications, jobs, users } from "@/db/schema";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum([
    "applied",
    "under_review",
    "shortlisted",
    "interview",
    "accepted",
    "rejected",
  ]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
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

    const { id } = await params;
    const body = await request.json();

    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid application status.",
        },
        { status: 400 }
      );
    }

    const existingApplication = await db
      .select({
        id: applications.id,
        jobId: applications.jobId,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(
        and(
          eq(applications.id, id),
          eq(jobs.employerId, employer.id)
        )
      )
      .limit(1);

    if (existingApplication.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
        },
        { status: 404 }
      );
    }

    const updated = await db
      .update(applications)
      .set({
        status: validation.data.status,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning({
        id: applications.id,
        status: applications.status,
        updatedAt: applications.updatedAt,
      });

    return NextResponse.json({
      success: true,
      application: updated[0],
    });
  } catch (error) {
    console.error("Employer application update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update application status.",
      },
      { status: 500 }
    );
  }
}

