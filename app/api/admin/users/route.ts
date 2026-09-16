import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

const updateUserSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
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

// GET /api/admin/users
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);

    if ("error" in adminCheck) {
      return adminCheck.error;
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "all";
    const status = searchParams.get("status")?.trim() || "all";

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    if (
      role === "candidate" ||
      role === "employer" ||
      role === "admin"
    ) {
      conditions.push(eq(users.role, role));
    }

    if (status === "active") {
      conditions.push(eq(users.isActive, true));
    }

    if (status === "inactive") {
      conditions.push(eq(users.isActive, false));
    }

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(users.name));

    return NextResponse.json({
      success: true,
      users: result,
    });
  } catch (error) {
    console.error("Admin users GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load users.",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users
export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);

    if ("error" in adminCheck) {
      return adminCheck.error;
    }

    const body = await request.json();

    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { userId, isActive } = validation.data;

    // Prevent admin from deactivating their own account.
    if (userId === adminCheck.session.user.id && !isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot deactivate your own admin account.",
        },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      });

    return NextResponse.json({
      success: true,
      message: isActive
        ? "User activated successfully."
        : "User deactivated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin users PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update user.",
      },
      { status: 500 }
    );
  }
}