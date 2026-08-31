"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { InterviewTimerBar } from "@/components/interview/timer-bar";
import { MonacoCodeEditor } from "@/components/ide/monaco-editor";
import { ProblemDescriptionPanel } from "@/components/ide/problem-description";
import { TestCasesPanel } from "@/components/ide/test-cases-panel";
import { ConsoleOutputPanel } from "@/components/ide/console-output";
import { AIChatBox, ChatMessage } from "@/components/interview/ai-chat-box";
import { HintModal } from "@/components/interview/hint-modal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ExecutionResult, ExecutionTestCase } from "@/lib/runner/types";
import {
  FileText,
  MessageSquare,
  Terminal,
  CheckCircle2,
  Play,
  Sparkles,
  Send,
  Code2,
  Layers,
} from "lucide-react";

export default function InterviewWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [interview, setInterview] = useState<any>(null);
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [testCases, setTestCases] = useState<ExecutionTestCase[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Desktop tabs
  const [leftTab, setLeftTab] = useState<string>("problem");
  const [bottomTab, setBottomTab] = useState<string>("testcases");

  // Mobile view switcher: "problem" | "chat" | "editor" | "console"
  const [mobileActiveTab, setMobileActiveTab] = useState<"problem" | "chat" | "editor" | "console">("editor");

  const [isLoading, setIsLoading] = useState(true);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchInterviewData();
  }, [id]);

  const fetchInterviewData = async () => {
    try {
      const res = await fetch(`/api/interview/${id}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Interview not found");
      }

      const data = await res.json();
      setInterview(data.interview);
      setProblem(data.interview.problemId);
      setCode(data.interview.currentCode || "");
      setLanguage(data.interview.language || "python");
      setMessages(data.interview.messages || []);
      setTestCases(data.interview.problemId?.testCases || []);
    } catch (err: any) {
      setError(err.message || "Failed to load interview session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    }
  };

  // Run code against visible test cases
  const handleRunCode = async () => {
    setIsRunningCode(true);
    setBottomTab("console");
    setMobileActiveTab("console");

    try {
      const res = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          testCases: testCases.filter((tc) => !tc.isHidden),
          interviewId: id,
          problemId: problem?._id,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setExecutionResult(data.result);
      }
    } catch (err: any) {
      console.error("Error executing code:", err);
    } finally {
      setIsRunningCode(false);
    }
  };

  // Submit code against all test cases (visible + hidden)
  const handleSubmitCode = async () => {
    setIsSubmittingCode(true);
    setBottomTab("console");
    setMobileActiveTab("console");

    try {
      const res = await fetch("/api/code/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: id,
          problemId: problem?._id,
          code,
          language,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setExecutionResult(data.result);

        // Notify AI interviewer of submission outcome
        const passMsg = `I just ran my solution against the full test suite (${data.result.passedTests}/${data.result.totalTests} tests passed). How does my code look?`;
        handleSendMessage(passMsg, "code_review");
      }
    } catch (err: any) {
      console.error("Error submitting code:", err);
    } finally {
      setIsSubmittingCode(false);
    }
  };

  // Chat message sender
  const handleSendMessage = async (
    text: string,
    type: "speech" | "hint" | "clarification" | "code_review" = "speech"
  ) => {
    setIsChatLoading(true);

    const tempMsg: ChatMessage = {
      role: "candidate",
      content: text,
      timestamp: new Date(),
      type,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/interview/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          type,
          currentCode: code,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRequestHint = async (level: number) => {
    await handleSendMessage(`I would like a Level ${level} hint to help guide my approach.`, "hint");
    setMobileActiveTab("chat");
  };

  // Final Evaluation and Finish Interview
  const handleFinalEvaluation = async () => {
    setIsEvaluating(true);
    setIsFinishConfirmOpen(false);

    try {
      const res = await fetch(`/api/interview/${id}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: id,
          finalCode: code,
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/interview/report/${id}`);
      } else {
        throw new Error(data.error || "Evaluation failed");
      }
    } catch (err: any) {
      alert("Evaluation failed: " + err.message);
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium">Entering AI Interview Workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !interview || !problem) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 p-4">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center max-w-md">
          <p className="text-sm text-rose-300 mb-4">{error || "Failed to load interview session."}</p>
          <Button variant="primary" size="sm" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Timer & Action Bar */}
      <InterviewTimerBar
        jobRole={interview.jobRole}
        difficulty={interview.difficulty}
        startedAt={interview.startedAt}
        onFinishInterview={() => setIsFinishConfirmOpen(true)}
        isEvaluating={isEvaluating}
      />

      {/* Mobile/Tablet View Switcher Bar (< lg) */}
      <div className="lg:hidden flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-2 py-1.5 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setMobileActiveTab("editor")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all whitespace-nowrap ${
              mobileActiveTab === "editor"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => setMobileActiveTab("problem")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all whitespace-nowrap ${
              mobileActiveTab === "problem"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Problem</span>
          </button>

          <button
            onClick={() => setMobileActiveTab("chat")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all whitespace-nowrap ${
              mobileActiveTab === "chat"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>AI Chat</span>
            {messages.length > 0 && (
              <span className="rounded-full bg-slate-800 text-[10px] px-1.5 text-indigo-300">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileActiveTab("console")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all whitespace-nowrap ${
              mobileActiveTab === "console"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Console</span>
            {executionResult && (
              <span
                className={`h-2 w-2 rounded-full ${
                  executionResult.status === "passed" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Single-Pane Full View (< lg) */}
      <div className="lg:hidden flex-1 overflow-hidden p-2">
        {mobileActiveTab === "editor" && (
          <div className="h-full flex flex-col">
            <MonacoCodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              onReset={handleResetCode}
              isRunning={isRunningCode}
              isSubmitting={isSubmittingCode}
            />
          </div>
        )}

        {mobileActiveTab === "problem" && (
          <div className="h-full overflow-y-auto">
            <ProblemDescriptionPanel
              problem={problem}
              onRequestHint={() => setIsHintModalOpen(true)}
            />
          </div>
        )}

        {mobileActiveTab === "chat" && (
          <div className="h-full flex flex-col">
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              onRequestHint={() => setIsHintModalOpen(true)}
            />
          </div>
        )}

        {mobileActiveTab === "console" && (
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setBottomTab("testcases")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  bottomTab === "testcases" ? "bg-slate-800 text-white" : "text-slate-400"
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setBottomTab("console")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  bottomTab === "console" ? "bg-slate-800 text-white" : "text-slate-400"
                }`}
              >
                Console Output
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {bottomTab === "testcases" ? (
                <TestCasesPanel testCases={testCases} onTestCasesChange={setTestCases} />
              ) : (
                <ConsoleOutputPanel result={executionResult} isRunning={isRunningCode || isSubmittingCode} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop 3-Pane Split Layout (>= lg) */}
      <div className="hidden lg:grid flex-1 grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* Left Column: Problem Statement & AI Chat Tabs (4 cols) */}
        <div className="col-span-4 flex flex-col h-full overflow-hidden space-y-2">
          <div className="flex items-center justify-between bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0">
            <div className="flex items-center gap-1 w-full">
              <button
                onClick={() => setLeftTab("problem")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  leftTab === "problem"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Problem Statement
              </button>
              <button
                onClick={() => setLeftTab("chat")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  leftTab === "chat"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                AI Interviewer
                {messages.length > 0 && (
                  <span className="rounded-full bg-indigo-600 px-1.5 text-[9px] text-white">
                    {messages.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {leftTab === "problem" ? (
              <ProblemDescriptionPanel
                problem={problem}
                onRequestHint={() => setIsHintModalOpen(true)}
              />
            ) : (
              <AIChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                onRequestHint={() => setIsHintModalOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Right 8 cols: Center Monaco Editor (top) + Bottom Test Cases / Console (bottom) */}
        <div className="col-span-8 flex flex-col h-full overflow-hidden space-y-2">
          {/* Upper Section: Monaco IDE */}
          <div className="flex-[6] min-h-[300px] overflow-hidden">
            <MonacoCodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              onReset={handleResetCode}
              isRunning={isRunningCode}
              isSubmitting={isSubmittingCode}
            />
          </div>

          {/* Lower Section: Test Cases & Console Runner Tabs */}
          <div className="flex-[4] min-h-[220px] flex flex-col bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBottomTab("testcases")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    bottomTab === "testcases"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  Test Cases
                </button>
                <button
                  onClick={() => setBottomTab("console")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    bottomTab === "console"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  Execution Console
                  {executionResult && (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        executionResult.status === "passed" ? "bg-emerald-400" : "bg-rose-400"
                      }`}
                    />
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Shortcuts: <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-300">Ctrl+Enter</kbd> to Run
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-2">
              {bottomTab === "testcases" ? (
                <TestCasesPanel
                  testCases={testCases}
                  onTestCasesChange={setTestCases}
                />
              ) : (
                <ConsoleOutputPanel
                  result={executionResult}
                  isRunning={isRunningCode || isSubmittingCode}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Hint Request Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        onRequestHint={handleRequestHint}
        isLoading={isChatLoading}
      />

      {/* Finish & Evaluate Confirmation Modal */}
      <Modal
        isOpen={isFinishConfirmOpen}
        onClose={() => setIsFinishConfirmOpen(false)}
        title="Finish Interview & Generate Evaluation?"
        description="Your final code will be executed across all test cases. The AI evaluator will score your algorithm complexity, code quality, edge cases, and reasoning."
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-300">
            <p className="font-semibold mb-1">What happens next:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Final code execution against visible and hidden test suites</li>
              <li>Big-O Time & Space complexity calculation</li>
              <li>Multi-dimensional rubric scorecard (0-100 overall)</li>
              <li>Actionable recommendations & optimal reference solution diff</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsFinishConfirmOpen(false)}>
              Continue Coding
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleFinalEvaluation}
              isLoading={isEvaluating}
            >
              Submit & View Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
