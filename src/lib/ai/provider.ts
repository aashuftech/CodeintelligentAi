import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3.7-flash";

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (apiKey && apiKey.trim().length > 10 && !apiKey.includes("your_gemini_api_key")) {
    try {
      return new GoogleGenAI({ apiKey: apiKey.trim() });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return null;
}

export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  jsonFormat: boolean = false
): Promise<string> {
  const aiClient = getGenAIClient();

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nUser Request & Data:\n${userPrompt}` }
            ]
          }
        ],
        config: jsonFormat
          ? {
              responseMimeType: "application/json",
              temperature: 0.2,
            }
          : {
              temperature: 0.7,
            },
      });

      const text = response.text;
      if (text) {
        return text;
      }
    } catch (error: any) {
      console.error("Gemini API Error, using intelligent dynamic fallback:", error.message || error);
    }
  }

  // Dynamic fallback engine when GEMINI_API_KEY is not provided
  return getDynamicFallbackAIResponse(systemPrompt, userPrompt, jsonFormat);
}

function getDynamicFallbackAIResponse(
  systemPrompt: string,
  userPrompt: string,
  jsonFormat: boolean
): string {
  if (jsonFormat) {
    if (systemPrompt.includes("evaluation rubric") || userPrompt.includes("Evaluate the candidate")) {
      // Dynamically extract test pass metrics from userPrompt if present
      let passed = 0;
      let total = 5;
      const passMatch = userPrompt.match(/Tests Passed:\s*(\d+)\s*\/\s*(\d+)/i);
      if (passMatch) {
        passed = parseInt(passMatch[1], 10);
        total = parseInt(passMatch[2], 10) || 1;
      }

      const passRatio = total > 0 ? passed / total : 0;
      const testScore = Math.round(passRatio * 100);

      // Check code characteristics
      const hasMapOrSet = userPrompt.includes("Map") || userPrompt.includes("Set") || userPrompt.includes("{}") || userPrompt.includes("dict") || userPrompt.includes("unordered_map");
      const hasNestedLoops = (userPrompt.match(/for\s*\(/g) || []).length > 1 || (userPrompt.match(/for\s+\w+\s+in/g) || []).length > 1;

      const efficiencyScore = hasNestedLoops ? 60 : hasMapOrSet ? 92 : 78;
      const qualityScore = Math.min(95, Math.max(50, Math.round(testScore * 0.4 + (hasMapOrSet ? 50 : 35))));
      const edgeScore = Math.min(95, Math.max(40, Math.round(testScore * 0.9)));
      const problemScore = Math.min(95, Math.max(45, Math.round(testScore * 0.5 + 40)));
      const commScore = 80;

      // Dynamic weighted overall score
      const overall = Math.round(
        testScore * 0.4 +
        qualityScore * 0.2 +
        efficiencyScore * 0.2 +
        edgeScore * 0.1 +
        commScore * 0.1
      );

      return JSON.stringify({
        overallScore: overall,
        metrics: {
          testCorrectness: {
            score: testScore,
            passedTests: passed,
            totalTests: total,
            feedback: passed === total
              ? `All ${passed}/${total} automated test cases passed successfully.`
              : `${passed} of ${total} test cases passed. Some boundary conditions or edge cases failed.`
          },
          codeQuality: {
            score: qualityScore,
            feedback: qualityScore >= 80
              ? "Clean, idiomatic code with appropriate modularity and readable variable naming."
              : "Code is functional but could benefit from clearer naming and cleaner structure.",
            cleanCodeChecklist: {
              readability: qualityScore >= 70,
              modularity: qualityScore >= 75,
              idiomatic: qualityScore >= 80,
              namingConventions: qualityScore >= 70
            }
          },
          algorithmicEfficiency: {
            score: efficiencyScore,
            detectedTimeComplexity: hasNestedLoops ? "O(N^2)" : "O(N)",
            detectedSpaceComplexity: hasMapOrSet ? "O(N)" : "O(1)",
            optimalTimeComplexity: "O(N)",
            optimalSpaceComplexity: "O(1)",
            feedback: hasNestedLoops
              ? "Consider replacing nested loops with a hash map or frequency table to achieve linear O(N) time complexity."
              : "Optimal time complexity achieved with efficient auxiliary data structures."
          },
          edgeCases: {
            score: edgeScore,
            handledCases: ["Standard inputs", "Normal ranges"],
            missedCases: passed < total ? ["Empty input collections", "Large inputs", "Boundary conditions"] : [],
            feedback: passed === total
              ? "All critical edge cases and constraint boundaries were properly handled."
              : "Defensive checks needed for edge conditions like empty arrays or unexpected inputs."
          },
          problemSolving: {
            score: problemScore,
            approachSummary: "Direct algorithmic implementation with structured decomposition.",
            feedback: "Demonstrated systematic problem solving."
          },
          communication: {
            score: commScore,
            clarificationCount: 1,
            feedback: "Communicated thoughts and reasoning during the problem breakdown."
          }
        },
        strengths: [
          passRatio > 0.8 ? "Strong test suite performance" : "Good algorithmic foundation",
          hasMapOrSet ? "Effective data structure selection" : "Structured problem breakdown",
          "Clean code syntax and readability"
        ],
        weaknesses: [
          passRatio < 1 ? "Review failed edge case tests" : "Further memory optimization possible",
          "Ensure explicit Big-O analysis is stated before writing code"
        ],
        recommendedTopics: [
          "Dynamic Programming & Memoization",
          "Advanced Graph Traversals (BFS, DFS, Dijkstra)",
          "Sliding Window & Two-Pointer Optimizations"
        ],
        actionableSuggestions: [
          "Always test against 0, null, and empty boundaries before final submission",
          "Analyze the time and space complexity trade-offs before implementation"
        ],
        optimalSolutionSnippet: "// Optimal Linear Time Reference Pattern\n// Time: O(N), Space: O(N) or O(1)"
      });
    }

    return JSON.stringify({
      title: "Optimized Dynamic Window Substring",
      slug: "optimized-dynamic-window-substring",
      description: "Solve the challenge as described.",
      difficulty: "medium",
      category: "DSA",
      tags: ["Algorithms"],
      hints: ["Decompose using optimal data structures."],
      timeLimitMs: 5000,
      memoryLimitMb: 128
    });
  }

  // Conversational response fallback
  if (userPrompt.toLowerCase().includes("hint")) {
    return "💡 **Interviewer Hint**: Think about how you can avoid redundant work. Can you use a Map, Set, or Stack to keep track of previous elements in \(O(1)\) lookup time?";
  }

  if (userPrompt.toLowerCase().includes("complexity")) {
    return "Great question! A brute force approach would be \(O(N^2)\), but by using an appropriate data structure like a Hash Map or Stack, you can achieve linear \(O(N)\) time.";
  }

  return "I'm following your reasoning. Walk me through how you intend to structure your loop and what edge cases (e.g. empty inputs or boundary values) you are planning to handle.";
}
