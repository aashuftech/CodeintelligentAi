import { describe, it, expect } from "vitest";
import { evaluateCandidateSession } from "../src/lib/ai/evaluator";

describe("AI Evaluation Engine & Rubric", () => {
  it("generates comprehensive multi-dimensional scorecard", async () => {
    const input = {
      jobRole: "Senior Backend Engineer",
      experienceLevel: "senior",
      difficulty: "medium",
      problemTitle: "Two Sum Target",
      problemDescription: "Given an array of integers nums and an integer target, return indices...",
      language: "python",
      finalCode: `
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []
      `,
      executionResult: {
        status: "passed" as const,
        passedTests: 4,
        totalTests: 4,
        testResults: [
          { testCaseIndex: 0, passed: true, input: "[[2,7], 9]", expectedOutput: "[0,1]", actualOutput: "[0,1]", stdout: "", stderr: "", executionTimeMs: 12, memoryKb: 1024 },
          { testCaseIndex: 1, passed: true, input: "[[3,2,4], 6]", expectedOutput: "[1,2]", actualOutput: "[1,2]", stdout: "", stderr: "", executionTimeMs: 10, memoryKb: 1024 },
        ],
        totalExecutionTimeMs: 22,
        peakMemoryKb: 1024,
      },
      messages: [
        { role: "interviewer", content: "What is your approach?" },
        { role: "candidate", content: "I plan to use a Hash Map to achieve O(N) linear time." },
      ],
      durationSeconds: 900,
    };

    const evaluation = await evaluateCandidateSession(input);

    expect(evaluation.overallScore).toBeGreaterThanOrEqual(50);
    expect(evaluation.overallScore).toBeLessThanOrEqual(100);
    expect(evaluation.metrics.testCorrectness.score).toBeGreaterThanOrEqual(80);
    expect(evaluation.metrics.codeQuality.score).toBeGreaterThanOrEqual(50);
    expect(evaluation.metrics.algorithmicEfficiency.score).toBeGreaterThanOrEqual(50);
    expect(Array.isArray(evaluation.strengths)).toBe(true);
    expect(Array.isArray(evaluation.weaknesses)).toBe(true);
    expect(Array.isArray(evaluation.recommendedTopics)).toBe(true);
  });
});
