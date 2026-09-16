import { NextResponse } from "next/server";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { categories, jobs } from "@/db/schema";

const jobTypeValues = [
  "full_time",
  "part_time",
  "internship",
  "contract",
  "remote",
] as const;

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  jobType: z.enum(jobTypeValues).optional(),
  categoryId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(9),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawQuery = {
      q: searchParams.get("q") || undefined,
      location: searchParams.get("location") || undefined,
      jobType: searchParams.get("jobType") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "9",
    };

    const result = querySchema.safeParse(rawQuery);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid search or filter parameters.",
        },
        { status: 400 }
      );
    }

    const { q, location, jobType, categoryId, page, limit } = result.data;

    const conditions = [eq(jobs.status, "approved")];

    if (q) {
      conditions.push(
        or(
          ilike(jobs.title, `%${q}%`),
          ilike(jobs.description, `%${q}%`),
          ilike(jobs.companyName, `%${q}%`)
        )!
      );
    }

    if (location) {
      conditions.push(ilike(jobs.location, `%${location}%`));
    }

    if (jobType) {
      conditions.push(eq(jobs.jobType, jobType));
    }

    if (categoryId) {
      conditions.push(eq(jobs.categoryId, categoryId));
    }

    const whereCondition = and(...conditions);

    const offset = (page - 1) * limit;

    const [jobResults, totalResult] = await Promise.all([
      db
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
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(whereCondition)
        .orderBy(desc(jobs.createdAt))
        .limit(limit)
        .offset(offset),

      db
        .select({
          total: count(),
        })
        .from(jobs)
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(whereCondition),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);

    return NextResponse.json({
      success: true,
      jobs: jobResults,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Jobs GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load jobs.",
      },
      { status: 500 }
    );
  }
}