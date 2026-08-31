import { generateAIResponse } from "./provider";
import { Problem, IProblem } from "../db/models/problem.model";
import connectToDatabase from "../db/mongodb";

export interface GenerateQuestionParams {
  jobRole: string;
  experienceLevel: string;
  difficulty: string;
  interviewType: string;
  language: string;
}

export async function getOrGenerateProblem(params: GenerateQuestionParams): Promise<IProblem> {
  await connectToDatabase();

  // Try to find a matching problem in the curated database
  const matchingProblems = await Problem.find({
    difficulty: params.difficulty.toLowerCase(),
    category: params.interviewType,
  }).limit(10);

  if (matchingProblems && matchingProblems.length > 0) {
    // Pick random match
    const selected = matchingProblems[Math.floor(Math.random() * matchingProblems.length)];
    return selected;
  }

  // If none found with exact category, search by difficulty
  const fallbackProblems = await Problem.find({
    difficulty: params.difficulty.toLowerCase(),
  }).limit(5);

  if (fallbackProblems && fallbackProblems.length > 0) {
    return fallbackProblems[Math.floor(Math.random() * fallbackProblems.length)];
  }

  // If DB is empty, dynamically generate problem via AI and persist it
  const systemPrompt = `
You are an expert Principal Engineer at a FAANG company designing a coding interview problem.
Target candidate:
- Role: ${params.jobRole}
- Level: ${params.experienceLevel}
- Difficulty: ${params.difficulty}
- Category: ${params.interviewType}
- Target Language: ${params.language}

Return a valid JSON object matching this schema:
{
  "title": string,
  "slug": string (kebab-case),
  "description": string (detailed problem statement with markdown, input format, output format, examples, constraints),
  "difficulty": "${params.difficulty.toLowerCase()}",
  "category": "${params.interviewType}",
  "tags": string[],
  "starterCode": {
    "javascript": string,
    "typescript": string,
    "python": string,
    "java": string,
    "cpp": string,
    "go": string
  },
  "testCases": [
    { "input": string, "expectedOutput": string, "isHidden": boolean, "explanation": string }
  ],
  "hints": string[],
  "timeLimitMs": 5000,
  "memoryLimitMb": 128
}
`;

  const userPrompt = `Generate a realistic, high-quality coding interview problem for a ${params.experienceLevel} ${params.jobRole}.`;

  try {
    const raw = await generateAIResponse(systemPrompt, userPrompt, true);
    const parsed = JSON.parse(raw);

    const newProblem = new Problem({
      title: parsed.title || "Custom Algorithm Problem",
      slug: parsed.slug || `custom-problem-${Date.now()}`,
      description: parsed.description || "Solve the coding challenge as described.",
      difficulty: params.difficulty.toLowerCase(),
      category: params.interviewType,
      tags: parsed.tags || ["Algorithms"],
      starterCode: parsed.starterCode || {
        javascript: "function solution(input) {\n  // Your code here\n}",
        typescript: "function solution(input: any): any {\n  // Your code here\n}",
        python: "def solution(input):\n    # Your code here\n    pass",
        java: "public class Solution {\n    public static Object solve(Object input) {\n        return null;\n    }\n}",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}",
        go: "package main\n\nfunc solution(input interface{}) interface{} {\n    return nil\n}",
      },
      testCases: parsed.testCases || [
        { input: "[1, 2, 3]", expectedOutput: "6", isHidden: false, explanation: "Sum of elements" },
      ],
      hints: parsed.hints || ["Think about optimal data structures."],
      timeLimitMs: 5000,
      memoryLimitMb: 128,
    });

    await newProblem.save();
    return newProblem;
  } catch (error) {
    console.error("Failed to generate problem via AI, creating fallback problem:", error);
    const fallback = new Problem({
      title: "Two Sum Target Lookup",
      slug: `two-sum-target-${Date.now()}`,
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n### Example 1:\n**Input:** `nums = [2,7,11,15], target = 9`\n**Output:** `[0,1]`\n\n### Constraints:\n- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`",
      difficulty: params.difficulty.toLowerCase(),
      category: params.interviewType,
      tags: ["Array", "Hash Table"],
      starterCode: {
        javascript: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
        typescript: "function twoSum(nums: number[], target: number): number[] {\n  // Write your code here\n  \n}",
        python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
        java: "public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}",
        go: "package main\n\nfunc twoSum(nums []int, target int) []int {\n    return []int{}\n}",
      },
      testCases: [
        { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]", isHidden: false, explanation: "2 + 7 = 9" },
        { input: "[[3,2,4], 6]", expectedOutput: "[1,2]", isHidden: false, explanation: "2 + 4 = 6" },
        { input: "[[3,3], 6]", expectedOutput: "[0,1]", isHidden: true, explanation: "Duplicate numbers" },
      ],
      hints: [
        "A brute-force search takes O(N^2) time. Can you do it in O(N)?",
        "Use a Hash Map to store elements you have seen and their indices.",
      ],
      timeLimitMs: 5000,
      memoryLimitMb: 128,
    });
    await fallback.save();
    return fallback;
  }
}
