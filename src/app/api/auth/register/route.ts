import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/user.model";
import { RegisterSchema } from "@/lib/validations/auth.schema";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie, isAdminEmail } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = parsed.data.email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(parsed.data.password);

    // Initial default skills profile
    const defaultSkills = [
      { name: "Algorithms & Data Structures", category: "DSA" as const, score: 70, assessedCount: 0 },
      { name: "System Design & Architecture", category: "SystemDesign" as const, score: 65, assessedCount: 0 },
      { name: "Code Cleanliness & Style", category: "CodeQuality" as const, score: 75, assessedCount: 0 },
      { name: "Problem Solving Approach", category: "ProblemSolving" as const, score: 70, assessedCount: 0 },
      { name: "Technical Communication", category: "Communication" as const, score: 70, assessedCount: 0 },
    ];

    const isConfiguredAdmin = isAdminEmail(normalizedEmail);

    const newUser = await User.create({
      name: parsed.data.name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      role: isConfiguredAdmin ? "admin" : "candidate",
      targetRole: parsed.data.targetRole || "Full Stack Engineer",
      experienceLevel: parsed.data.experienceLevel || "mid",
      skills: defaultSkills,
      totalInterviews: 0,
      averageScore: 0,
    });

    const token = await createSessionToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        targetRole: newUser.targetRole,
        experienceLevel: newUser.experienceLevel,
      },
    });

    return setSessionCookie(res, token);
  } catch (error: unknown) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
