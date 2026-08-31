import { z } from "zod";

export const TestCaseInputSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().default(false),
  explanation: z.string().optional(),
});

export const ProblemInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.enum(["DSA", "SystemDesign", "BugFix", "Refactoring", "Practical"]),
  tags: z.array(z.string()).default([]),
  roleAffinity: z.array(z.string()).default([]),
  starterCode: z.object({
    javascript: z.string().default(""),
    typescript: z.string().default(""),
    python: z.string().default(""),
    java: z.string().default(""),
    cpp: z.string().default(""),
    go: z.string().default(""),
  }),
  solutionCode: z
    .object({
      javascript: z.string().optional(),
      typescript: z.string().optional(),
      python: z.string().optional(),
      java: z.string().optional(),
      cpp: z.string().optional(),
      go: z.string().optional(),
    })
    .optional(),
  testCases: z.array(TestCaseInputSchema).min(1, "At least one test case is required"),
  hints: z.array(z.string()).default([]),
  timeLimitMs: z.number().default(5000),
  memoryLimitMb: z.number().default(128),
});

export type ProblemInput = z.infer<typeof ProblemInputSchema>;
