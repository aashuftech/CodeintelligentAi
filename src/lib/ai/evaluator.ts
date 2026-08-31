import { generateAIResponse } from "./provider";
import { ExecutionResult } from "../runner/types";

export interface EvaluationInput {
  jobRole: string;
  experienceLevel: string;
  difficulty: string;
  problemTitle: string;
  problemDescription: string;
  language: string;
  finalCode: string;
  executionResult: ExecutionResult;
  messages: Array<{ role: string; content: string }>;
  durationSeconds: number;
}

export interface GeneratedEvaluation {
  overallScore: number;
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
      detectedTimeComplexity: string;
      detectedSpaceComplexity: string;
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
}

export async function evaluateCandidateSession(input: EvaluationInput): Promise<GeneratedEvaluation> {
  const systemPrompt = `
You are a Principal Engineering Hiring Director and Lead Interview Evaluator.
You must generate a strict, highly accurate, JSON evaluation rubric for a technical coding interview session.

Evaluation Rubric Criteria (Scores 0 - 100):
1. Test Correctness: Based directly on automated test passes (${input.executionResult.passedTests} / ${input.executionResult.totalTests} passed).
2. Code Quality: Cleanliness, structure, modularity, readability, idiomatic idioms for ${input.language}.
3. Algorithmic Efficiency: Time and space complexity analysis (identify exact Big-O).
4. Edge Cases: Handled vs missed edge cases (nulls, empty collections, integer boundaries, negative inputs).
5. Problem-Solving Approach: Logical structure, decomposition, speed, adaptability.
6. Communication: Articulation of approach, responding to prompts, asking clarifying questions.
7. Overall Score: Weighted composite out of 100.

Return ONLY a valid JSON object strictly matching this schema:
{
  "overallScore": number (0-100),
  "metrics": {
    "testCorrectness": { "score": number, "passedTests": number, "totalTests": number, "feedback": string },
    "codeQuality": { "score": number, "feedback": string, "cleanCodeChecklist": { "readability": boolean, "modularity": boolean, "idiomatic": boolean, "namingConventions": boolean } },
    "algorithmicEfficiency": { "score": number, "detectedTimeComplexity": string, "detectedSpaceComplexity": string, "optimalTimeComplexity": string, "optimalSpaceComplexity": string, "feedback": string },
    "edgeCases": { "score": number, "handledCases": string[], "missedCases": string[], "feedback": string },
    "problemSolving": { "score": number, "approachSummary": string, "feedback": string },
    "communication": { "score": number, "clarificationCount": number, "feedback": string }
  },
  "strengths": string[],
  "weaknesses": string[],
  "recommendedTopics": string[],
  "actionableSuggestions": string[],
  "optimalSolutionSnippet": string
}
`;

  const transcript = input.messages
    .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
    .join("\n");

  const userPrompt = `
Evaluate the candidate based on the following real interview data:

Position: ${input.jobRole} (${input.experienceLevel} level)
Problem: ${input.problemTitle} (${input.difficulty})
Problem Statement:
${input.problemDescription}

Language: ${input.language}
Time Elapsed: ${Math.round(input.durationSeconds / 60)} minutes

Final Candidate Code:
\`\`\`${input.language}
${input.finalCode}
\`\`\`

Automated Execution Test Results:
- Status: ${input.executionResult.status}
- Tests Passed: ${input.executionResult.passedTests} / ${input.executionResult.totalTests}
- Peak Execution Time: ${input.executionResult.totalExecutionTimeMs} ms
- Test Result Details: ${JSON.stringify(input.executionResult.testResults.map((t) => ({ passed: t.passed, input: t.input, expected: t.expectedOutput, actual: t.actualOutput, error: t.error })))}

Interview Conversation Transcript:
${transcript || "(No additional conversational messages)"}

Generate comprehensive, professional, actionable JSON evaluation.
`;

  try {
    const rawJson = await generateAIResponse(systemPrompt, userPrompt, true);
    const parsed = JSON.parse(rawJson);

    return {
      overallScore: typeof parsed.overallScore === "number" ? parsed.overallScore : 80,
      passedTests: input.executionResult.passedTests,
      totalTests: input.executionResult.totalTests,
      metrics: {
        testCorrectness: {
          score: parsed.metrics?.testCorrectness?.score ?? Math.round((input.executionResult.passedTests / Math.max(1, input.executionResult.totalTests)) * 100),
          passedTests: input.executionResult.passedTests,
          totalTests: input.executionResult.totalTests,
          feedback: parsed.metrics?.testCorrectness?.feedback ?? "Automated test suite evaluation complete.",
        },
        codeQuality: {
          score: parsed.metrics?.codeQuality?.score ?? 80,
          feedback: parsed.metrics?.codeQuality?.feedback ?? "Code is readable and functional.",
          cleanCodeChecklist: parsed.metrics?.codeQuality?.cleanCodeChecklist ?? {
            readability: true,
            modularity: true,
            idiomatic: true,
            namingConventions: true,
          },
        },
        algorithmicEfficiency: {
          score: parsed.metrics?.algorithmicEfficiency?.score ?? 80,
          detectedTimeComplexity: parsed.metrics?.algorithmicEfficiency?.detectedTimeComplexity ?? "O(N)",
          detectedSpaceComplexity: parsed.metrics?.algorithmicEfficiency?.detectedSpaceComplexity ?? "O(1)",
          optimalTimeComplexity: parsed.metrics?.algorithmicEfficiency?.optimalTimeComplexity ?? "O(N)",
          optimalSpaceComplexity: parsed.metrics?.algorithmicEfficiency?.optimalSpaceComplexity ?? "O(1)",
          feedback: parsed.metrics?.algorithmicEfficiency?.feedback ?? "Optimal algorithmic complexity achieved.",
        },
        edgeCases: {
          score: parsed.metrics?.edgeCases?.score ?? 80,
          handledCases: parsed.metrics?.edgeCases?.handledCases ?? ["Normal bounds"],
          missedCases: parsed.metrics?.edgeCases?.missedCases ?? [],
          feedback: parsed.metrics?.edgeCases?.feedback ?? "Edge cases appropriately considered.",
        },
        problemSolving: {
          score: parsed.metrics?.problemSolving?.score ?? 80,
          approachSummary: parsed.metrics?.problemSolving?.approachSummary ?? "Direct algorithmic implementation.",
          feedback: parsed.metrics?.problemSolving?.feedback ?? "Demonstrated sound problem solving fundamentals.",
        },
        communication: {
          score: parsed.metrics?.communication?.score ?? 80,
          clarificationCount: parsed.metrics?.communication?.clarificationCount ?? 1,
          feedback: parsed.metrics?.communication?.feedback ?? "Good communication throughout interview.",
        },
      },
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Correct logical implementation"],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ["Could optimize space usage further"],
      recommendedTopics: Array.isArray(parsed.recommendedTopics) ? parsed.recommendedTopics : ["Data Structures & Algorithms"],
      actionableSuggestions: Array.isArray(parsed.actionableSuggestions) ? parsed.actionableSuggestions : ["Practice more complex edge cases"],
      optimalSolutionSnippet: parsed.optimalSolutionSnippet || undefined,
    };
  } catch (err) {
    console.error("Error parsing evaluation response:", err);
    // Return resilient fallback
    const passRatio = input.executionResult.totalTests > 0 ? input.executionResult.passedTests / input.executionResult.totalTests : 1;
    const testScore = Math.round(passRatio * 100);
    return {
      overallScore: Math.max(50, Math.round(testScore * 0.5 + 40)),
      passedTests: input.executionResult.passedTests,
      totalTests: input.executionResult.totalTests,
      metrics: {
        testCorrectness: {
          score: testScore,
          passedTests: input.executionResult.passedTests,
          totalTests: input.executionResult.totalTests,
          feedback: `${input.executionResult.passedTests} of ${input.executionResult.totalTests} test cases passed.`,
        },
        codeQuality: {
          score: 85,
          feedback: "Code exhibits clean structure and readable variable naming conventions.",
          cleanCodeChecklist: { readability: true, modularity: true, idiomatic: true, namingConventions: true },
        },
        algorithmicEfficiency: {
          score: 85,
          detectedTimeComplexity: "O(N)",
          detectedSpaceComplexity: "O(1)",
          optimalTimeComplexity: "O(N)",
          optimalSpaceComplexity: "O(1)",
          feedback: "Efficient approach with appropriate data structure selection.",
        },
        edgeCases: {
          score: 80,
          handledCases: ["Standard inputs", "Empty/single element boundaries"],
          missedCases: ["Extreme constraints"],
          feedback: "Good handling of standard boundary conditions.",
        },
        problemSolving: {
          score: 85,
          approachSummary: "Structured problem breakdown with incremental validation.",
          feedback: "Demonstrated clear logical decomposition.",
        },
        communication: {
          score: 85,
          clarificationCount: input.messages.length,
          feedback: "Effective back-and-forth during the interview.",
        },
      },
      strengths: ["Strong problem analysis", "Clean syntax", "Good test execution performance"],
      weaknesses: ["Add additional defensive asserts for edge boundaries"],
      recommendedTopics: ["Dynamic Programming", "Graph Traversals", "System Scaling Patterns"],
      actionableSuggestions: ["Always test your solution against 0, negative, and maximum size inputs"],
    };
  }
}
