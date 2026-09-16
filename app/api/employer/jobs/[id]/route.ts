import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, users } from "@/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateJobSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(20).max(5000),
  companyName: z.string().trim().min(2).max(150),
  location: z.string().trim().min(2).max(150),
  jobType: z.enum([
    "full_time",
    "part_time",
    "internship",
    "contract",
    "remote",
  ]),
  salary: z.string().trim().max(150).optional().or(z.literal("")),
  requirements: z.string().trim().max(5000).optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
});

async function getEmployer(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return null;
  }

  const result = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (
    result.length === 0 ||
    result[0].role !== "employer" ||
    !result[0].isActive
  ) {
    return null;
  }

  return result[0];
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const employer = await getEmployer(request);

    if (!employer) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.employerId, employer.id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: result[0],
    });
  } catch (error) {
    console.error("Employer job GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load job.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const employer = await getEmployer(request);

    if (!employer) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingJob = await db
      .select({
        id: jobs.id,
        status: jobs.status,
      })
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.employerId, employer.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateJobSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0]?.message || "Invalid job details.",
        },
        { status: 400 }
      );
    }

    const data = result.data;

    await db
      .update(jobs)
      .set({
        categoryId: data.categoryId || null,
        title: data.title,
        description: data.description,
        companyName: data.companyName,
        location: data.location,
        jobType: data.jobType,
        salary: data.salary || null,
        requirements: data.requirements || null,
        deadline: data.deadline || null,

        // Any employer edit goes back through moderation.
        status: "pending",

        updatedAt: new Date(),
      })
      .where(
        and(eq(jobs.id, id), eq(jobs.employerId, employer.id))
      );

    return NextResponse.json({
      success: true,
      message: "Job updated and submitted for admin approval.",
    });
  } catch (error) {
    console.error("Employer job PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update job.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const employer = await getEmployer(request);

    if (!employer) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingJob = await db
      .select({
        id: jobs.id,
      })
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.employerId, employer.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }

    await db
      .delete(jobs)
      .where(
        and(eq(jobs.id, id), eq(jobs.employerId, employer.id))
      );

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Employer job DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete job.",
      },
      { status: 500 }
    );
  }
}