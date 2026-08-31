import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestResult {
  testCaseIndex: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  stdout?: string;
  stderr?: string;
  executionTimeMs: number;
  memoryKb?: number;
  error?: string;
}

export interface ISubmission extends Document {
  interviewId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  language: string;
  code: string;
  status: "passed" | "failed" | "compilation_error" | "runtime_error" | "timeout";
  passedTests: number;
  totalTests: number;
  testResults: ITestResult[];
  executionTimeMs: number;
  memoryUsageKb: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema = new Schema<ITestResult>({
  testCaseIndex: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  actualOutput: { type: String },
  stdout: { type: String },
  stderr: { type: String },
  executionTimeMs: { type: Number, default: 0 },
  memoryKb: { type: Number, default: 0 },
  error: { type: String },
});

const SubmissionSchema = new Schema<ISubmission>(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ["passed", "failed", "compilation_error", "runtime_error", "timeout"],
      required: true,
    },
    passedTests: { type: Number, required: true },
    totalTests: { type: Number, required: true },
    testResults: { type: [TestResultSchema], default: [] },
    executionTimeMs: { type: Number, default: 0 },
    memoryUsageKb: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ problemId: 1, userId: 1, createdAt: -1 });

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
export default Submission;
