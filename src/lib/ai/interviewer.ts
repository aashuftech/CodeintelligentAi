import { generateAIResponse } from "./provider";

export interface InterviewContext {
  jobRole: string;
  experienceLevel: string;
  difficulty: string;
  interviewType: string;
  language: string;
  problemTitle: string;
  problemDescription: string;
  currentCode?: string;
  hints: string[];
  previousMessages: Array<{ role: string; content: string }>;
}

export async function generateInterviewerResponse(
  context: InterviewContext,
  candidateMessage: string,
  messageType: "speech" | "hint" | "proactive_question" | "code_review" | "clarification" = "speech"
): Promise<string> {
  const systemPrompt = `
You are a Principal Software Engineer & AI Technical Interviewer at a top-tier tech company conducting a live technical coding interview.

Candidate Details:
- Target Role: ${context.jobRole}
- Target Level: ${context.experienceLevel}
- Interview Focus: ${context.interviewType} (Difficulty: ${context.difficulty})
- Selected Language: ${context.language}

Problem Being Solved:
Title: ${context.problemTitle}
Description:
${context.problemDescription}

Known Problem Hints:
${context.hints.map((h, i) => `Hint ${i + 1}: ${h}`).join("\n")}

Behavioral Guidelines:
1. Be professional, supportive, yet rigorous—simulate a real FAANG / top tech company interview.
2. If the candidate asks for a hint:
   - Provide a progressive, concise hint without writing out full solution code.
   - Guide their thought process (e.g. Socratic questioning, asking about data structures or invariants).
3. If candidate writes or modifies code:
   - Acknowledge their strategy, ask clarifying questions about edge cases, time/space complexity, or trade-offs.
4. Keep responses focused and concise (1-3 short paragraphs max). Never dump walls of code.
`;

  const transcript = context.previousMessages
    .slice(-6)
    .map((m) => `${m.role === "interviewer" ? "Interviewer" : "Candidate"}: ${m.content}`)
    .join("\n");

  const userPrompt = `
Conversation History:
${transcript}

Candidate's Current Working Code in Editor:
\`\`\`${context.language}
${context.currentCode || "(No code written yet)"}
\`\`\`

Candidate Just Said / Action (${messageType}):
"${candidateMessage}"

Respond naturally as the technical interviewer to guide and evaluate the candidate:
`;

  return generateAIResponse(systemPrompt, userPrompt, false);
}

export async function generateProgressiveHint(
  context: InterviewContext,
  hintLevel: number // 1, 2, or 3
): Promise<string> {
  const systemPrompt = `
You are a Lead Technical Interviewer giving a targeted hint to a candidate.
Problem: ${context.problemTitle}
Description: ${context.problemDescription}

Available hints:
${context.hints.map((h, i) => `Hint ${i + 1}: ${h}`).join("\n")}

Current working code:
\`\`\`${context.language}
${context.currentCode || "None"}
\`\`\`

Hint Level Requested: Level ${hintLevel} of 3
- Level 1: High-level conceptual nudge (e.g., recommend a category of data structure or general pattern).
- Level 2: Algorithmic approach hint (e.g., explain the two-pointer or sliding window condition or state transition).
- Level 3: Concrete invariant or edge case pointer (very specific, but still without giving full source code).

Respond directly with the hint in a friendly, encouraging interviewer voice.
`;

  const userPrompt = `Provide a Level ${hintLevel} hint for this problem.`;
  return generateAIResponse(systemPrompt, userPrompt, false);
}
