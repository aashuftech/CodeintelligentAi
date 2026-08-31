import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterviewMessage {
  role: "interviewer" | "candidate" | "system";
  content: string;
  timestamp: Date;
  type?: "speech" | "hint" | "proactive_question" | "code_review" | "clarification";
}

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  jobRole: string;
  experienceLevel: "junior" | "mid" | "senior" | "lead";
  difficulty: "easy" | "medium" | "hard";
  interviewType: "DSA" | "SystemDesign" | "BugFix" | "Refactoring" | "Practical";
  language: string;
  status: "pending" | "in_progress" | "completed" | "abandoned";
  currentCode: string;
  messages: IInterviewMessage[];
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;
  score?: number; // 0 - 100
  evaluationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewMessageSchema = new Schema<IInterviewMessage>({
  role: { type: String, enum: ["interviewer", "candidate", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ["speech", "hint", "proactive_question", "code_review", "clarification"],
    default: "speech",
  },
});

const InterviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    jobRole: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    interviewType: {
      type: String,
      enum: ["DSA", "SystemDesign", "BugFix", "Refactoring", "Practical"],
      required: true,
    },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "abandoned"],
      default: "in_progress",
      index: true,
    },
    currentCode: { type: String, default: "" },
    messages: { type: [InterviewMessageSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, default: 0 },
    score: { type: Number, min: 0, max: 100 },
    evaluationId: { type: Schema.Types.ObjectId, ref: "Evaluation" },
  },
  {
    timestamps: true,
  }
);

InterviewSchema.index({ userId: 1, createdAt: -1 });

export const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
export default Interview;
