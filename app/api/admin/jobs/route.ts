import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, users } from "@/db/schema";

const updateJobSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(["pending", "approved", "rejected", "closed"]),
});

async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if ("error" in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(jobs.title, `%${search}%`),
          ilike(jobs.companyName, `%${search}%`),
          ilike(jobs.location, `%${search}%`)
        )
      );
    }

    if (
      status === "pending" ||
      status === "approved" ||
      status === "rejected" ||
      status === "closed"
    ) {
      conditions.push(eq(jobs.status, status));
    }

    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        companyName: jobs.companyName,
        location: jobs.location,
        jobType: jobs.jobType,
        salary: jobs.salary,
        requirements: jobs.requirements,
        deadline: jobs.deadline,
        status: jobs.status,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        employerId: jobs.employerId,
        employerName: users.name,
        employerEmail: users.email,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.employerId, users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(jobs.createdAt));

    return NextResponse.json({
      success: true,
      jobs: result,
    });
  } catch (error) {
    console.error("Admin jobs GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load jobs.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if ("error" in authResult) {
      return authResult.error;
    }

    const body = await request.json();

    const validation = updateJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid job update data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { jobId, status } = validation.data;

    const existingJob = await db
      .select({
        id: jobs.id,
        title: jobs.title,
      })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!existingJob.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found.",
        },
        { status: 404 }
      );
    }

    const [updatedJob] = await db
      .update(jobs)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning({
        id: jobs.id,
        title: jobs.title,
        status: jobs.status,
        updatedAt: jobs.updatedAt,
      });

    return NextResponse.json({
      success: true,
      message: `Job ${status} successfully.`,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Admin jobs PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update job.",
      },
      { status: 500 }
    );
  }
}