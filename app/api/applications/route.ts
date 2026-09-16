import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { applications, categories, jobs } from "@/db/schema";
import { auth } from "@/lib/auth";

const applySchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().trim().min(50).max(5000),
  resumeUrl: z.string().trim().url().or(z.literal("")).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to apply for a job.",
        },
        { status: 401 }
      );
    }

    const role = (session.user as { role?: string }).role;

    if (role !== "candidate") {
      return NextResponse.json(
        {
          success: false,
          message: "Only candidates can apply for jobs.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = applySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a cover letter of at least 50 characters and a valid resume URL.",
        },
        { status: 400 }
      );
    }

    const { jobId, coverLetter, resumeUrl } = result.data;

    const jobResult = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        deadline: jobs.deadline,
      })
      .from(jobs)
      .where(
        and(
          eq(jobs.id, jobId),
          eq(jobs.status, "approved")
        )
      )
      .limit(1);

    if (jobResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This job is no longer available.",
        },
        { status: 404 }
      );
    }

    const job = jobResult[0];

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "The application deadline for this job has passed.",
        },
        { status: 400 }
      );
    }

    const existingApplication = await db
      .select({
        id: applications.id,
      })
      .from(applications)
      .where(
        and(
          eq(applications.jobId, jobId),
          eq(applications.candidateId, session.user.id)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already applied for this job.",
        },
        { status: 409 }
      );
    }

    const [application] = await db
      .insert(applications)
      .values({
        jobId,
        candidateId: session.user.id,
        coverLetter,
        resumeUrl: resumeUrl || null,
        status: "applied",
      })
      .returning({
        id: applications.id,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your application.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to view your applications.",
        },
        { status: 401 }
      );
    }

    const role = (session.user as { role?: string }).role;

    if (role !== "candidate") {
      return NextResponse.json(
        {
          success: false,
          message: "Only candidates can view candidate applications.",
        },
        { status: 403 }
      );
    }

    const results = await db
      .select({
        id: applications.id,
        jobId: applications.jobId,
        jobTitle: jobs.title,
        companyName: jobs.companyName,
        location: jobs.location,
        jobType: jobs.jobType,
        categoryName: categories.name,
        coverLetter: applications.coverLetter,
        resumeUrl: applications.resumeUrl,
        status: applications.status,
        appliedAt: applications.appliedAt,
        updatedAt: applications.updatedAt,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(eq(applications.candidateId, session.user.id))
      .orderBy(desc(applications.appliedAt));

    return NextResponse.json({
      success: true,
      applications: results,
    });
  } catch (error) {
    console.error("Applications GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your applications.",
      },
      { status: 500 }
    );
  }
}