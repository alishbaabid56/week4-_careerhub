import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
      })
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json({
      success: true,
      categories: result,
    });
  } catch (error) {
    console.error("Categories GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load categories.",
      },
      { status: 500 }
    );
  }
}