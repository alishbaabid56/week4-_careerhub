import { NextRequest, NextResponse } from "next/server";
import { asc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories } from "@/db/schema";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(100, "Category name is too long."),
  description: z
    .string()
    .trim()
    .max(500, "Description is too long.")
    .optional()
    .default(""),
});

const updateCategorySchema = categorySchema.extend({
  categoryId: z.string().uuid(),
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

/* GET — List Categories */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if ("error" in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
      })
      .from(categories)
      .where(
        search
          ? or(
              ilike(categories.name, `%${search}%`),
              ilike(categories.description, `%${search}%`)
            )
          : undefined
      )
      .orderBy(asc(categories.name));

    return NextResponse.json({
      success: true,
      categories: result,
    });
  } catch (error) {
    console.error("Admin categories GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load categories.",
      },
      { status: 500 }
    );
  }
}

/* POST — Create Category */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if ("error" in authResult) {
      return authResult.error;
    }

    const body = await request.json();

    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, description } = validation.data;

    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (existing.length) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this name already exists.",
        },
        { status: 409 }
      );
    }

    const [category] = await db
      .insert(categories)
      .values({
        name,
        description,
      })
      .returning({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin categories POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create category.",
      },
      { status: 500 }
    );
  }
}

/* PUT — Update Category */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if ("error" in authResult) {
      return authResult.error;
    }

    const body = await request.json();

    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category update data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { categoryId, name, description } = validation.data;

    const existing = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    const duplicate = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (duplicate.length && duplicate[0].id !== categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Another category with this name already exists.",
        },
        { status: 409 }
      );
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name,
        description,
      })
      .where(eq(categories.id, categoryId))
      .returning({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
      });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Admin categories PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update category.",
      },
      { status: 500 }
    );
  }
}

/* DELETE — Delete Category */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if ("error" in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID is required.",
        },
        { status: 400 }
      );
    }

    const validation = z.string().uuid().safeParse(categoryId);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        { status: 400 }
      );
    }

    const existing = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Admin categories DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete category.",
      },
      { status: 500 }
    );
  }
}