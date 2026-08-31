import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Interview from "@/lib/db/models/interview.model";
import Problem from "@/lib/db/models/problem.model";
import Submission from "@/lib/db/models/submission.model";
import Evaluation from "@/lib/db/models/evaluation.model";
import User from "@/lib/db/models/user.model";
import { EvaluateInterviewSchema } from "@/lib/validations/interview.schema";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { executeCode } from "@/lib/runner/sandbox";
import { evaluateCandidateSession } from "@/lib/ai/evaluator";

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
    const parsed = EvaluateInterviewSchema.safeParse({ ...body, interviewId: id });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid evaluation payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const interview = await Interview.findById(id).populate("problemId");
    if (!interview) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    if (interview.userId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const problem = interview.problemId as any;

    // Execute code on ALL problem test cases (visible and hidden)
    const executionResult = await executeCode({
      code: parsed.data.finalCode,
      language: parsed.data.language as any,
      testCases: problem.testCases.map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        explanation: tc.explanation,
        isHidden: tc.isHidden,
      })),
      timeLimitMs: problem.timeLimitMs || 5000,
      memoryLimitMb: problem.memoryLimitMb || 128,
    });

    // Record submission
    const submission = await Submission.create({
      interviewId: interview._id,
      userId: user._id,
      problemId: problem._id,
      language: parsed.data.language,
      code: parsed.data.finalCode,
      status: executionResult.status,
      passedTests: executionResult.passedTests,
      totalTests: executionResult.totalTests,
      testResults: executionResult.testResults,
      executionTimeMs: executionResult.totalExecutionTimeMs,
      memoryUsageKb: executionResult.peakMemoryKb,
    });

    // Calculate duration in seconds
    const endedAt = new Date();
    const durationSeconds = Math.max(
      60,
      Math.round((endedAt.getTime() - new Date(interview.startedAt).getTime()) / 1000)
    );

    // Run AI Evaluation
    const evaluationData = await evaluateCandidateSession({
      jobRole: interview.jobRole,
      experienceLevel: interview.experienceLevel,
      difficulty: interview.difficulty,
      problemTitle: problem.title,
      problemDescription: problem.description,
      language: parsed.data.language,
      finalCode: parsed.data.finalCode,
      executionResult,
      messages: interview.messages,
      durationSeconds,
    });

    // Create Evaluation in DB
    const evaluation = await Evaluation.create({
      interviewId: interview._id,
      userId: user._id,
      problemId: problem._id,
      overallScore: evaluationData.overallScore,
      passedTests: evaluationData.passedTests,
      totalTests: evaluationData.totalTests,
      metrics: evaluationData.metrics,
      strengths: evaluationData.strengths,
      weaknesses: evaluationData.weaknesses,
      recommendedTopics: evaluationData.recommendedTopics,
      actionableSuggestions: evaluationData.actionableSuggestions,
      optimalSolutionSnippet: evaluationData.optimalSolutionSnippet,
    });

    // Update Interview
    interview.status = "completed";
    interview.currentCode = parsed.data.finalCode;
    interview.endedAt = endedAt;
    interview.durationSeconds = durationSeconds;
    interview.score = evaluationData.overallScore;
    interview.evaluationId = evaluation._id;
    await interview.save();

    // Update User Stats and Skills
    const userDoc = await User.findById(user._id);
    if (userDoc) {
      userDoc.totalInterviews = (userDoc.totalInterviews || 0) + 1;
      const prevTotal = (userDoc.averageScore || 0) * (userDoc.totalInterviews - 1);
      userDoc.averageScore = Math.round((prevTotal + evaluationData.overallScore) / userDoc.totalInterviews);

      // Update skill categories
      const categoryMap: Record<string, number> = {
        DSA: evaluationData.metrics.algorithmicEfficiency.score,
        SystemDesign: evaluationData.metrics.problemSolving.score,
        CodeQuality: evaluationData.metrics.codeQuality.score,
        ProblemSolving: evaluationData.metrics.problemSolving.score,
        Communication: evaluationData.metrics.communication.score,
      };

      userDoc.skills.forEach((skill) => {
        if (categoryMap[skill.category] !== undefined) {
          const currentScore = skill.score || 70;
          const newScore = categoryMap[skill.category];
          skill.score = Math.round((currentScore * skill.assessedCount + newScore) / (skill.assessedCount + 1));
          skill.assessedCount += 1;
        }
      });

      await userDoc.save();
    }

    return NextResponse.json({
      success: true,
      evaluationId: evaluation._id,
      overallScore: evaluationData.overallScore,
      submission,
      evaluation,
    });
  } catch (error: unknown) {
    console.error("Evaluate Interview Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
