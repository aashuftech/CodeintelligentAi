import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Interview from "@/lib/db/models/interview.model";
import Problem from "@/lib/db/models/problem.model";
import { InterviewChatSchema } from "@/lib/validations/interview.schema";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { generateInterviewerResponse, generateProgressiveHint } from "@/lib/ai/interviewer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = InterviewChatSchema.safeParse({ ...body, interviewId: id });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid message payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const interview = await Interview.findById(id).populate("problemId");
    if (!interview) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    if (interview.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const problem = interview.problemId as any;

    // Save candidate message
    const candidateMsg = {
      role: "candidate" as const,
      content: parsed.data.message,
      timestamp: new Date(),
      type: parsed.data.type || "speech",
    };
    interview.messages.push(candidateMsg);

    if (parsed.data.currentCode) {
      interview.currentCode = parsed.data.currentCode;
    }

    let interviewerContent = "";

    if (parsed.data.type === "hint") {
      // Calculate hint level based on number of hints already requested
      const previousHintCount = interview.messages.filter((m: any) => m.type === "hint").length;
      const hintLevel = Math.min(3, Math.max(1, previousHintCount));
      interviewerContent = await generateProgressiveHint(
        {
          jobRole: interview.jobRole,
          experienceLevel: interview.experienceLevel,
          difficulty: interview.difficulty,
          interviewType: interview.interviewType,
          language: interview.language,
          problemTitle: problem.title,
          problemDescription: problem.description,
          currentCode: interview.currentCode,
          hints: problem.hints || [],
          previousMessages: interview.messages,
        },
        hintLevel
      );
    } else {
      interviewerContent = await generateInterviewerResponse(
        {
          jobRole: interview.jobRole,
          experienceLevel: interview.experienceLevel,
          difficulty: interview.difficulty,
          interviewType: interview.interviewType,
          language: interview.language,
          problemTitle: problem.title,
          problemDescription: problem.description,
          currentCode: interview.currentCode,
          hints: problem.hints || [],
          previousMessages: interview.messages,
        },
        parsed.data.message,
        parsed.data.type || "speech"
      );
    }

    const interviewerMsg = {
      role: "interviewer" as const,
      content: interviewerContent,
      timestamp: new Date(),
      type: parsed.data.type === "hint" ? ("hint" as const) : ("speech" as const),
    };
    interview.messages.push(interviewerMsg);

    await interview.save();

    return NextResponse.json({
      success: true,
      message: interviewerMsg,
    });
  } catch (error: unknown) {
    console.error("Interview Chat Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
