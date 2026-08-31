import { NextRequest, NextResponse } from "next/server";
import { RunCodeSchema } from "@/lib/validations/code.schema";
import { executeCode } from "@/lib/runner/sandbox";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = RunCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid execution request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await executeCode({
      code: parsed.data.code,
      language: parsed.data.language,
      testCases: parsed.data.testCases,
      timeLimitMs: 5000,
      memoryLimitMb: 128,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    console.error("Run Code Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Execution error" },
      { status: 500 }
    );
  }
}
