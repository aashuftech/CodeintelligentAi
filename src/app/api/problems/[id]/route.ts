import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Problem from "@/lib/db/models/problem.model";
import { ProblemInputSchema } from "@/lib/validations/problem.schema";
import { getAuthenticatedUser, isAdminEmail } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const problem = await Problem.findById(id);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error: unknown) {
    console.error("Get Problem Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch problem" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    const isAdmin = user && (user.role === "admin" || isAdminEmail(user.email));

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = ProblemInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Problem.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, problem: updated });
  } catch (error: unknown) {
    console.error("Update Problem Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update problem" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    const isAdmin = user && (user.role === "admin" || isAdminEmail(user.email));

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Problem deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete Problem Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete problem" },
      { status: 500 }
    );
  }
}
