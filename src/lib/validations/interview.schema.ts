import { z } from "zod";

export const CreateInterviewSchema = z.object({
  jobRole: z.string().min(1, "Job role is required"),
  experienceLevel: z.enum(["junior", "mid", "senior", "lead"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  interviewType: z.enum(["DSA", "SystemDesign", "BugFix", "Refactoring", "Practical"]),
  language: z.enum(["javascript", "typescript", "python", "java", "cpp", "go"]),
  problemId: z.string().optional(),
});

export const InterviewChatSchema = z.object({
  interviewId: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["speech", "hint", "proactive_question", "code_review", "clarification"]).optional().default("speech"),
  currentCode: z.string().optional(),
});

export const EvaluateInterviewSchema = z.object({
  interviewId: z.string().min(1),
  finalCode: z.string().min(1),
  language: z.string().min(1),
});

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>;
export type InterviewChatInput = z.infer<typeof InterviewChatSchema>;
export type EvaluateInterviewInput = z.infer<typeof EvaluateInterviewSchema>;
