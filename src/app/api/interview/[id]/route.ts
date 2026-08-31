import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Interview from "@/lib/db/models/interview.model";
import Problem from "@/lib/db/models/problem.model";
import Submission from "@/lib/db/models/submission.model";
import Evaluation from "@/lib/db/models/evaluation.model";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const interview = await Interview.findById(id).populate("problemId");
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // RBAC: only owner or admin can view
    if (interview.userId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submissions = await Submission.find({ interviewId: interview._id })
      .sort({ createdAt: -1 })
      .limit(10);

    let evaluation = null;
    if (interview.evaluationId) {
      evaluation = await Evaluation.findById(interview.evaluationId);
    }

    return NextResponse.json({
      interview,
      submissions,
      evaluation,
    });
  } catch (error: unknown) {
    console.error("Get Interview Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
