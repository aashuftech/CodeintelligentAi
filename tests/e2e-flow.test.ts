import { describe, it, expect } from "vitest";
import { executeCode } from "../src/lib/runner/sandbox";
import { evaluateCandidateSession } from "../src/lib/ai/evaluator";
import { generateInterviewerResponse, generateProgressiveHint } from "../src/lib/ai/interviewer";

describe("End-to-End Interview Simulation Flow", () => {
  it("executes complete lifecycle: Setup -> Code Run -> AI Hint -> Code Submit -> Evaluation", async () => {
    // 1. Problem Specification
    const problem = {
      title: "Valid Parentheses String",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if valid.",
      difficulty: "easy",
      category: "DSA",
      hints: [
        "Use a stack to track opening brackets.",
        "When encountering a closing bracket, pop from the stack.",
      ],
      testCases: [
        { input: "\"()[]{}\"", expectedOutput: "true", isHidden: false },
        { input: "\"(]\"", expectedOutput: "false", isHidden: false },
        { input: "\"([{}])\"", expectedOutput: "true", isHidden: false },
        { input: "\"[\"", expectedOutput: "false", isHidden: true },
      ],
    };

    // 2. Candidate initiates conversation with Interviewer
    const initialGreeting = await generateInterviewerResponse(
      {
        jobRole: "Frontend Engineer",
        experienceLevel: "mid",
        difficulty: "easy",
        interviewType: "DSA",
        language: "javascript",
        problemTitle: problem.title,
        problemDescription: problem.description,
        hints: problem.hints,
        previousMessages: [],
      },
      "Hello! I understand the problem. I plan to use a Stack data structure to match open and close brackets."
    );

    expect(typeof initialGreeting).toBe("string");
    expect(initialGreeting.length).toBeGreaterThan(10);

    // 3. Candidate requests progressive hint Level 1
    const hint1 = await generateProgressiveHint(
      {
        jobRole: "Frontend Engineer",
        experienceLevel: "mid",
        difficulty: "easy",
        interviewType: "DSA",
        language: "javascript",
        problemTitle: problem.title,
        problemDescription: problem.description,
        hints: problem.hints,
        previousMessages: [
          { role: "interviewer", content: initialGreeting },
          { role: "candidate", content: "Can I get a quick hint?" },
        ],
      },
      1
    );

    expect(typeof hint1).toBe("string");
    expect(hint1.length).toBeGreaterThan(10);

    // 4. Candidate writes JavaScript solution and runs sample test cases
    const candidateCode = `
      function isValid(s) {
        const stack = [];
        const map = {
          ')': '(',
          '}': '{',
          ']': '['
        };
        for (let i = 0; i < s.length; i++) {
          const char = s[i];
          if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
          } else if (map[char]) {
            if (stack.length === 0 || stack.pop() !== map[char]) {
              return false;
            }
          }
        }
        return stack.length === 0;
      }
    `;

    const sampleRunResult = await executeCode({
      code: candidateCode,
      language: "javascript",
      testCases: problem.testCases.filter((t) => !t.isHidden),
    });

    expect(sampleRunResult.status).toBe("passed");
    expect(sampleRunResult.passedTests).toBe(3);

    // 5. Candidate submits against ALL test cases (including hidden)
    const fullSubmissionResult = await executeCode({
      code: candidateCode,
      language: "javascript",
      testCases: problem.testCases,
    });

    expect(fullSubmissionResult.status).toBe("passed");
    expect(fullSubmissionResult.passedTests).toBe(4);
    expect(fullSubmissionResult.totalTests).toBe(4);

    // 6. Complete Session Evaluation is generated
    const evaluation = await evaluateCandidateSession({
      jobRole: "Frontend Engineer",
      experienceLevel: "mid",
      difficulty: "easy",
      problemTitle: problem.title,
      problemDescription: problem.description,
      language: "javascript",
      finalCode: candidateCode,
      executionResult: fullSubmissionResult,
      messages: [
        { role: "interviewer", content: initialGreeting },
        { role: "candidate", content: "I'll use a stack for linear time complexity." },
        { role: "interviewer", content: hint1 },
      ],
      durationSeconds: 720,
    });

    expect(evaluation.overallScore).toBeGreaterThanOrEqual(70);
    expect(evaluation.metrics.testCorrectness.score).toBeGreaterThanOrEqual(80);
    expect(evaluation.metrics.codeQuality.score).toBeGreaterThan(60);
    expect(evaluation.metrics.algorithmicEfficiency.score).toBeGreaterThan(60);
    expect(evaluation.strengths.length).toBeGreaterThan(0);
  });
});
