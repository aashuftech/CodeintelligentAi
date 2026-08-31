import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Problem from "@/lib/db/models/problem.model";
import { ProblemInputSchema } from "@/lib/validations/problem.schema";
import { getAuthenticatedUser, isAdminEmail } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, any> = {};
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty.toLowerCase();
    }
    if (category && category !== "all") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      problems: problems.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        description: p.description,
        difficulty: p.difficulty,
        category: p.category,
        tags: p.tags,
        hintsCount: p.hints?.length || 0,
        testCasesCount: p.testCases?.length || 0,
        starterCode: p.starterCode,
        createdAt: p.createdAt,
      })),
    });
  } catch (error: unknown) {
    console.error("Fetch Problems Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const isAdmin = user && (user.role === "admin" || isAdminEmail(user.email));

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = ProblemInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Problem.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A problem with this slug already exists" },
        { status: 409 }
      );
    }

    const problem = await Problem.create({
      ...parsed.data,
      authorId: user?._id,
    });

    return NextResponse.json({ success: true, problem }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create Problem Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create problem" },
      { status: 500 }
    );
  }
}
