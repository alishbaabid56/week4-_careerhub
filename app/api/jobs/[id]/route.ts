
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, jobs } from "@/db/schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    // Get only approved job details
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
        categoryId: jobs.categoryId,
        categoryName: categories.name,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .leftJoin(
        categories,
        eq(jobs.categoryId, categories.id)
      )
      .where(
        and(
          eq(jobs.id, id),
          eq(jobs.status, "approved")
        )
      )
      .limit(1);

    // Job doesn't exist or isn't approved
    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: result[0],
    });
  } catch (error) {
    console.error("Job details GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load job details.",
      },
      { status: 500 }
    );
  }
}

