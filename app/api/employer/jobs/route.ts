import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories, jobs, users } from "@/db/schema";

const createJobSchema = z.object({
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

    const employerJobs = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        companyName: jobs.companyName,
        location: jobs.location,
        jobType: jobs.jobType,
        salary: jobs.salary,
        deadline: jobs.deadline,
        status: jobs.status,
        categoryName: categories.name,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(eq(jobs.employerId, employer.id))
      .orderBy(desc(jobs.createdAt));

    return NextResponse.json({
      success: true,
      jobs: employerJobs,
    });
  } catch (error) {
    console.error("Employer jobs GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your jobs.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    const result = createJobSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.error.issues[0]?.message || "Invalid job details.",
        },
        { status: 400 }
      );
    }

    const data = result.data;

    if (data.categoryId) {
      const category = await db
        .select({
          id: categories.id,
        })
        .from(categories)
        .where(eq(categories.id, data.categoryId))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Selected category does not exist.",
          },
          { status: 400 }
        );
      }
    }

    const newJob = await db
      .insert(jobs)
      .values({
        employerId: employer.id,
        categoryId: data.categoryId || null,
        title: data.title,
        description: data.description,
        companyName: data.companyName,
        location: data.location,
        jobType: data.jobType,
        salary: data.salary || null,
        requirements: data.requirements || null,
        deadline: data.deadline || null,
        status: "pending",
      })
      .returning({
        id: jobs.id,
        title: jobs.title,
        status: jobs.status,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Job submitted for admin approval.",
        job: newJob[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employer jobs POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create job.",
      },
      { status: 500 }
    );
  }
}