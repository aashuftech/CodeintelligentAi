import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/user.model";
import Interview from "@/lib/db/models/interview.model";
import Evaluation from "@/lib/db/models/evaluation.model";
import Submission from "@/lib/db/models/submission.model";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const interviews = await Interview.find({ userId: user._id })
      .populate("problemId", "title difficulty category tags")
      .sort({ createdAt: -1 })
      .limit(20);

    const evaluations = await Evaluation.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const submissionsCount = await Submission.countDocuments({
      userId: user._id,
      status: "passed",
    });

    const completedInterviews = interviews.filter((i) => i.status === "completed");
    const totalCompleted = completedInterviews.length;
    const avgScore =
      totalCompleted > 0
        ? Math.round(
            completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0) / totalCompleted
          )
        : 0;

    // Dynamically calculate skill proficiency from real evaluations if available
    let dynamicSkills = [
      { name: "Algorithms & Data Structures", category: "DSA" as const, score: 0, assessedCount: 0 },
      { name: "System Design & Architecture", category: "SystemDesign" as const, score: 0, assessedCount: 0 },
      { name: "Code Cleanliness & Style", category: "CodeQuality" as const, score: 0, assessedCount: 0 },
      { name: "Problem Solving Approach", category: "ProblemSolving" as const, score: 0, assessedCount: 0 },
      { name: "Technical Communication", category: "Communication" as const, score: 0, assessedCount: 0 },
    ];

    if (evaluations.length > 0) {
      let dsaTotal = 0, sysTotal = 0, qualityTotal = 0, problemTotal = 0, commTotal = 0;
      let count = evaluations.length;

      evaluations.forEach((ev) => {
        dsaTotal += ev.metrics?.algorithmicEfficiency?.score || ev.overallScore || 0;
        sysTotal += ev.metrics?.edgeCases?.score || ev.overallScore || 0;
        qualityTotal += ev.metrics?.codeQuality?.score || ev.overallScore || 0;
        problemTotal += ev.metrics?.problemSolving?.score || ev.overallScore || 0;
        commTotal += ev.metrics?.communication?.score || ev.overallScore || 0;
      });

      dynamicSkills = [
        { name: "Algorithms & Data Structures", category: "DSA", score: Math.round(dsaTotal / count), assessedCount: count },
        { name: "System Design & Architecture", category: "SystemDesign", score: Math.round(sysTotal / count), assessedCount: count },
        { name: "Code Cleanliness & Style", category: "CodeQuality", score: Math.round(qualityTotal / count), assessedCount: count },
        { name: "Problem Solving Approach", category: "ProblemSolving", score: Math.round(problemTotal / count), assessedCount: count },
        { name: "Technical Communication", category: "Communication", score: Math.round(commTotal / count), assessedCount: count },
      ];
    }

    // Collect all unique recommended topics from recent evaluations
    const recommendedTopicsSet = new Set<string>();
    evaluations.forEach((ev) => {
      ev.recommendedTopics?.forEach((t) => recommendedTopicsSet.add(t));
    });

    if (recommendedTopicsSet.size === 0) {
      recommendedTopicsSet.add("Dynamic Programming Optimization");
      recommendedTopicsSet.add("Graph BFS/DFS & Dijkstra");
      recommendedTopicsSet.add("Sliding Window & Two Pointers");
      recommendedTopicsSet.add("Concurrency & Race Conditions");
    }

    // Historical score trend
    const scoreHistory = completedInterviews
      .slice(0, 10)
      .reverse()
      .map((i, idx) => ({
        index: idx + 1,
        date: new Date(i.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: i.score || 0,
        difficulty: i.difficulty,
      }));

    return NextResponse.json({
      stats: {
        totalInterviews: interviews.length,
        completedInterviews: totalCompleted,
        averageScore: avgScore,
        problemsSolved: submissionsCount,
        targetRole: user.targetRole || "Full Stack Engineer",
        experienceLevel: user.experienceLevel || "mid",
      },
      skills: dynamicSkills,
      recentInterviews: interviews.map((i) => ({
        id: i._id,
        problemTitle: (i.problemId as any)?.title || "Coding Challenge",
        difficulty: i.difficulty,
        interviewType: i.interviewType,
        language: i.language,
        status: i.status,
        score: i.score,
        durationSeconds: i.durationSeconds,
        startedAt: i.startedAt,
        evaluationId: i.evaluationId,
      })),
      scoreHistory,
      recommendedTopics: Array.from(recommendedTopicsSet).slice(0, 6),
    });
  } catch (error: unknown) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
