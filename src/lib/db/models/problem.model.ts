import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: "DSA" | "SystemDesign" | "BugFix" | "Refactoring" | "Practical";
  tags: string[];
  roleAffinity: string[]; // e.g. ["Frontend Engineer", "Backend Engineer"]
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
    java: string;
    cpp: string;
    go: string;
  };
  solutionCode?: {
    javascript?: string;
    typescript?: string;
    python?: string;
    java?: string;
    cpp?: string;
    go?: string;
  };
  testCases: ITestCase[];
  hints: string[];
  timeLimitMs: number;
  memoryLimitMb: number;
  authorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String },
});

const ProblemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true, index: true },
    category: {
      type: String,
      enum: ["DSA", "SystemDesign", "BugFix", "Refactoring", "Practical"],
      required: true,
      index: true,
    },
    tags: { type: [String], default: [], index: true },
    roleAffinity: { type: [String], default: [] },
    starterCode: {
      javascript: { type: String, default: "" },
      typescript: { type: String, default: "" },
      python: { type: String, default: "" },
      java: { type: String, default: "" },
      cpp: { type: String, default: "" },
      go: { type: String, default: "" },
    },
    solutionCode: {
      javascript: { type: String },
      typescript: { type: String },
      python: { type: String },
      java: { type: String },
      cpp: { type: String },
      go: { type: String },
    },
    testCases: { type: [TestCaseSchema], required: true },
    hints: { type: [String], default: [] },
    timeLimitMs: { type: Number, default: 5000 },
    memoryLimitMb: { type: Number, default: 128 },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

ProblemSchema.index({ difficulty: 1, category: 1 });

export const Problem: Model<IProblem> =
  mongoose.models.Problem || mongoose.model<IProblem>("Problem", ProblemSchema);
export default Problem;
