import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isAdminEmail } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const effectiveRole = user.role === "admin" || isAdminEmail(user.email) ? "admin" : user.role;

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: effectiveRole,
        avatar: user.avatar,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        totalInterviews: user.totalInterviews,
        averageScore: user.averageScore,
      },
    });
  } catch (error: unknown) {
    console.error("Get Current User Error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
