import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMetricScore {
  score: number; // 0 - 100
  feedback: string;
  details?: Record<string, unknown>;
}

export interface IEvaluation extends Document {
  interviewId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  overallScore: number; // 0 - 100
  passedTests: number;
  totalTests: number;
  metrics: {
    testCorrectness: {
      score: number;
      passedTests: number;
      totalTests: number;
      feedback: string;
    };
    codeQuality: {
      score: number;
      feedback: string;
      cleanCodeChecklist?: {
        readability: boolean;
        modularity: boolean;
        idiomatic: boolean;
        namingConventions: boolean;
      };
    };
    algorithmicEfficiency: {
      score: number;
      detectedTimeComplexity: string; // e.g. "O(N)"
      detectedSpaceComplexity: string; // e.g. "O(1)"
      optimalTimeComplexity: string;
      optimalSpaceComplexity: string;
      feedback: string;
    };
    edgeCases: {
      score: number;
      handledCases: string[];
      missedCases: string[];
      feedback: string;
    };
    problemSolving: {
      score: number;
      approachSummary: string;
      feedback: string;
    };
    communication: {
      score: number;
      clarificationCount: number;
      feedback: string;
    };
  };
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
  actionableSuggestions: string[];
  optimalSolutionSnippet?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MetricScoreSchema = new Schema<IMetricScore>(
  {
    score: { type: Number, required: true, min: 0, max: 100 },
    feedback: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const EvaluationSchema = new Schema<IEvaluation>(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    passedTests: { type: Number, required: true },
    totalTests: { type: Number, required: true },
    metrics: {
      testCorrectness: {
        score: { type: Number, required: true },
        passedTests: { type: Number, required: true },
        totalTests: { type: Number, required: true },
        feedback: { type: String, required: true },
      },
      codeQuality: {
        score: { type: Number, required: true },
        feedback: { type: String, required: true },
        cleanCodeChecklist: {
          readability: { type: Boolean, default: true },
          modularity: { type: Boolean, default: true },
          idiomatic: { type: Boolean, default: true },
          namingConventions: { type: Boolean, default: true },
        },
      },
      algorithmicEfficiency: {
        score: { type: Number, required: true },
        detectedTimeComplexity: { type: String, default: "N/A" },
        detectedSpaceComplexity: { type: String, default: "N/A" },
        optimalTimeComplexity: { type: String, default: "N/A" },
        optimalSpaceComplexity: { type: String, default: "N/A" },
        feedback: { type: String, required: true },
      },
      edgeCases: {
        score: { type: Number, required: true },
        handledCases: { type: [String], default: [] },
        missedCases: { type: [String], default: [] },
        feedback: { type: String, required: true },
      },
      problemSolving: {
        score: { type: Number, required: true },
        approachSummary: { type: String, default: "" },
        feedback: { type: String, required: true },
      },
      communication: {
        score: { type: Number, required: true },
        clarificationCount: { type: Number, default: 0 },
        feedback: { type: String, required: true },
      },
    },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendedTopics: { type: [String], default: [] },
    actionableSuggestions: { type: [String], default: [] },
    optimalSolutionSnippet: { type: String },
  },
  {
    timestamps: true,
  }
);

EvaluationSchema.index({ userId: 1, overallScore: -1 });

export const Evaluation: Model<IEvaluation> =
  mongoose.models.Evaluation || mongoose.model<IEvaluation>("Evaluation", EvaluationSchema);
export default Evaluation;
