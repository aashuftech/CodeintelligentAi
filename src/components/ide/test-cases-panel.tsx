"use client";

import React, { useState } from "react";
import { ExecutionTestCase } from "@/lib/runner/types";
import { Plus, Check, X, ShieldAlert, Code2 } from "lucide-react";

interface TestCasesPanelProps {
  testCases: ExecutionTestCase[];
  onTestCasesChange: (cases: ExecutionTestCase[]) => void;
}

export function TestCasesPanel({ testCases, onTestCasesChange }: TestCasesPanelProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [customExpected, setCustomExpected] = useState("");

  const visibleCases = testCases.filter((tc) => !tc.isHidden);
  const currentCase = visibleCases[selectedCaseIdx] || visibleCases[0];

  const handleAddCustomCase = () => {
    if (!customInput.trim()) return;
    const newCase: ExecutionTestCase = {
      input: customInput.trim(),
      expectedOutput: customExpected.trim() || "null",
      explanation: "Custom Candidate Test Case",
      isHidden: false,
    };
    onTestCasesChange([...testCases, newCase]);
    setCustomInput("");
    setCustomExpected("");
    setSelectedCaseIdx(visibleCases.length);
  };

  return (
    <div className="flex h-full flex-col bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-sm font-mono">
      {/* Test Case Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-3.5">
        <div className="flex items-center gap-2 overflow-x-auto">
          {visibleCases.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCaseIdx(idx)}
              className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                selectedCaseIdx === idx
                  ? "bg-slate-800 text-indigo-400 border border-indigo-500/40 shadow-sm"
                  : "bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>

        <span className="text-xs font-sans font-medium text-slate-400 hidden sm:inline">
          {testCases.filter((t) => t.isHidden).length} hidden test cases
        </span>
      </div>

      {/* Case Details */}
      {currentCase ? (
        <div className="flex-1 space-y-3.5 overflow-y-auto">
          <div>
            <label className="block text-xs sm:text-sm font-sans font-bold text-slate-300 mb-1.5">
              Input Argument(s):
            </label>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-slate-100 break-all font-mono text-xs sm:text-sm">
              {currentCase.input}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-sans font-bold text-slate-300 mb-1.5">
              Expected Return Value:
            </label>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-emerald-400 break-all font-mono text-xs sm:text-sm font-bold">
              {currentCase.expectedOutput}
            </div>
          </div>

          {currentCase.explanation && (
            <p className="text-xs sm:text-sm font-sans text-slate-400 italic">
              Explanation: {currentCase.explanation}
            </p>
          )}
        </div>
      ) : (
        <div className="text-slate-400 text-center py-6 text-sm font-medium">No test cases found</div>
      )}

      {/* Quick Add Custom Test Case Form */}
      <div className="mt-3.5 pt-3.5 border-t border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-2">
        <input
          type="text"
          placeholder="Custom Input (e.g. [4, 5, 6], 10)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Expected Output"
          value={customExpected}
          onChange={(e) => setCustomExpected(e.target.value)}
          className="w-36 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleAddCustomCase}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
