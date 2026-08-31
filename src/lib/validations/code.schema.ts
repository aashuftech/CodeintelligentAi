import { z } from "zod";

export const RunCodeSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  language: z.enum(["javascript", "typescript", "python", "java", "cpp", "go"]),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      explanation: z.string().optional(),
    })
  ).min(1, "At least one test case is required"),
  problemId: z.string().optional(),
  interviewId: z.string().optional(),
});

export const SubmitCodeSchema = z.object({
  interviewId: z.string().min(1, "Interview ID is required"),
  problemId: z.string().min(1, "Problem ID is required"),
  code: z.string().min(1, "Code cannot be empty"),
  language: z.enum(["javascript", "typescript", "python", "java", "cpp", "go"]),
});

export type RunCodeInput = z.infer<typeof RunCodeSchema>;
export type SubmitCodeInput = z.infer<typeof SubmitCodeSchema>;
