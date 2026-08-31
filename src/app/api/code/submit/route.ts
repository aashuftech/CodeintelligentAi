import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Problem from "@/lib/db/models/problem.model";
import Submission from "@/lib/db/models/submission.model";
import Interview from "@/lib/db/models/interview.model";
import { SubmitCodeSchema } from "@/lib/validations/code.schema";
import { executeCode } from "@/lib/runner/sandbox";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SubmitCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const problem = await Problem.findById(parsed.data.problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const result = await executeCode({
      code: parsed.data.code,
      language: parsed.data.language,
      testCases: problem.testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        explanation: tc.explanation,
        isHidden: tc.isHidden,
      })),
      timeLimitMs: problem.timeLimitMs || 5000,
      memoryLimitMb: problem.memoryLimitMb || 128,
    });

    const submission = await Submission.create({
      interviewId: parsed.data.interviewId,
      userId: user._id,
      problemId: problem._id,
      language: parsed.data.language,
      code: parsed.data.code,
      status: result.status,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      testResults: result.testResults,
      executionTimeMs: result.totalExecutionTimeMs,
      memoryUsageKb: result.peakMemoryKb,
    });

    // Update interview current code
    if (parsed.data.interviewId) {
      await Interview.findByIdAndUpdate(parsed.data.interviewId, {
        currentCode: parsed.data.code,
      });
    }

    return NextResponse.json({
      success: true,
      submissionId: submission._id,
      result,
    });
  } catch (error: unknown) {
    console.error("Submit Code Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Submission error" },
      { status: 500 }
    );
  }
}
