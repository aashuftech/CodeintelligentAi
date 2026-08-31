import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Interview from "@/lib/db/models/interview.model";
import Problem from "@/lib/db/models/problem.model";
import { CreateInterviewSchema } from "@/lib/validations/interview.schema";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getOrGenerateProblem } from "@/lib/ai/question-gen";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid interview parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let problem = null;
    if (parsed.data.problemId) {
      problem = await Problem.findById(parsed.data.problemId);
    }

    if (!problem) {
      problem = await getOrGenerateProblem({
        jobRole: parsed.data.jobRole,
        experienceLevel: parsed.data.experienceLevel,
        difficulty: parsed.data.difficulty,
        interviewType: parsed.data.interviewType,
        language: parsed.data.language,
      });
    }

    const selectedLang = parsed.data.language as keyof typeof problem.starterCode;
    const initialCode =
      problem.starterCode[selectedLang] ||
      `// Write your ${parsed.data.language} solution here\n`;

    const greetingMessage = {
      role: "interviewer" as const,
      content: `Hello ${user.name}! Welcome to your technical coding interview for the **${parsed.data.jobRole}** (${parsed.data.experienceLevel} level) role.\n\nToday we'll be tackling **"${problem.title}"** in **${parsed.data.language.toUpperCase()}**.\n\nPlease take a few moments to read through the problem description and constraints on the left. Feel free to explain your initial thoughts, ask clarifying questions, or discuss your planned approach before jumping into the code!\n\nWhenever you're ready, let me know your high-level strategy.`,
      timestamp: new Date(),
      type: "speech" as const,
    };

    const newInterview = await Interview.create({
      userId: user._id,
      problemId: problem._id,
      jobRole: parsed.data.jobRole,
      experienceLevel: parsed.data.experienceLevel,
      difficulty: parsed.data.difficulty,
      interviewType: parsed.data.interviewType,
      language: parsed.data.language,
      status: "in_progress",
      currentCode: initialCode,
      messages: [greetingMessage],
      startedAt: new Date(),
      durationSeconds: 0,
    });

    return NextResponse.json({
      success: true,
      interviewId: newInterview._id,
      problem: {
        id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        category: problem.category,
        tags: problem.tags,
        hints: problem.hints,
        testCases: problem.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          explanation: tc.explanation,
        })),
        starterCode: problem.starterCode,
      },
    });
  } catch (error: unknown) {
    console.error("Create Interview Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
