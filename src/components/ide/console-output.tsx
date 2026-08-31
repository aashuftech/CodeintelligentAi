"use client";

import React, { useState } from "react";
import { ExecutionResult } from "@/lib/runner/types";
import { CheckCircle2, XCircle, Clock, Cpu, Terminal, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
}

export function ConsoleOutputPanel({ result, isRunning = false }: ConsoleOutputProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (isRunning) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm sm:text-base font-semibold">Executing code in secure sandbox container...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-slate-400 text-sm font-mono text-center space-y-2">
        <Terminal className="h-10 w-10 mb-1 opacity-40 text-slate-300 mx-auto" />
        <p className="font-semibold text-slate-300">No active execution output</p>
        <p className="text-xs text-slate-500 font-sans">Press "Run Code" or "Submit Solution" to execute test suites.</p>
      </div>
    );
  }

  const isSuccess = result.status === "passed";
  const selectedTest = result.testResults[selectedCaseIdx] || result.testResults[0];

  return (
    <div className="flex h-full flex-col bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-sm font-mono overflow-hidden">
      {/* Top Banner Status & Execution Metrics */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-3.5">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-sans text-sm sm:text-base">
              <CheckCircle2 className="h-5 w-5" />
              <span>Accepted ({result.passedTests}/{result.totalTests} Passed)</span>
            </div>
          ) : result.status === "timeout" ? (
            <div className="flex items-center gap-2 text-amber-400 font-bold font-sans text-sm sm:text-base">
              <Clock className="h-5 w-5" />
              <span>Time Limit Exceeded</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-400 font-bold font-sans text-sm sm:text-base">
              <XCircle className="h-5 w-5" />
              <span>
                {result.status === "compilation_error"
                  ? "Compilation Error"
                  : result.status === "runtime_error"
                  ? "Runtime Error"
                  : "Wrong Answer"}
              </span>
            </div>
          )}
        </div>

        {/* Resource Badges */}
        <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-300 font-sans font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <strong className="text-white font-mono">{result.totalExecutionTimeMs} ms</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-slate-400" />
            <strong className="text-white font-mono">{result.peakMemoryKb} KB</strong>
          </span>
        </div>
      </div>

      {/* Compiler or Runtime Global Errors */}
      {result.compilerError && (
        <div className="mb-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200 overflow-x-auto whitespace-pre-wrap text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-rose-300">
            <AlertTriangle className="h-4 w-4" /> Compiler Error:
          </div>
          {result.compilerError}
        </div>
      )}

      {/* Test Case Selector Badges */}
      {result.testResults && result.testResults.length > 0 && (
        <>
          <div className="flex items-center gap-2 overflow-x-auto mb-3.5 pb-2 border-b border-slate-800/80">
            {result.testResults.map((tc, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs sm:text-sm transition-all font-bold ${
                  selectedCaseIdx === idx
                    ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    tc.passed ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                <span>Case {idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Detailed Selected Test Case Matrix */}
          {selectedTest && (
            <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
              <div>
                <span className="block text-xs sm:text-sm font-sans font-bold text-slate-300 mb-1.5">Input:</span>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-slate-100 break-all text-xs sm:text-sm">
                  {selectedTest.input}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <span className="block text-xs sm:text-sm font-sans font-bold text-slate-300 mb-1.5">Output:</span>
                  <div
                    className={`rounded-xl border p-3.5 break-all text-xs sm:text-sm font-bold ${
                      selectedTest.passed
                        ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                        : "border-rose-500/30 bg-rose-950/20 text-rose-300"
                    }`}
                  >
                    {selectedTest.actualOutput || "null"}
                  </div>
                </div>

                <div>
                  <span className="block text-xs sm:text-sm font-sans font-bold text-slate-300 mb-1.5">Expected:</span>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-emerald-400 break-all text-xs sm:text-sm font-bold">
                    {selectedTest.expectedOutput}
                  </div>
                </div>
              </div>

              {selectedTest.stdout && (
                <div>
                  <span className="block text-xs sm:text-sm font-sans font-bold text-slate-300 mb-1.5">Standard Output (stdout):</span>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-slate-300 whitespace-pre-wrap text-xs sm:text-sm">
                    {selectedTest.stdout}
                  </div>
                </div>
              )}

              {selectedTest.error && (
                <div>
                  <span className="block text-xs sm:text-sm font-sans font-bold text-rose-400 mb-1.5">Runtime Error / Exception:</span>
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 text-rose-300 whitespace-pre-wrap text-xs sm:text-sm">
                    {selectedTest.error}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
