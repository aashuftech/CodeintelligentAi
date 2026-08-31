"use client";

import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { getDifficultyColor } from "@/lib/utils";
import { FileText, Lightbulb, CheckCircle2, ChevronDown, ChevronRight, Sparkles } from "lucide-react";

interface ProblemDescriptionProps {
  problem: {
    title: string;
    description: string;
    difficulty: string;
    category: string;
    tags?: string[];
    hints?: string[];
  };
  onRequestHint?: () => void;
}

export function ProblemDescriptionPanel({ problem, onRequestHint }: ProblemDescriptionProps) {
  const diff = getDifficultyColor(problem.difficulty);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-7 text-slate-200 shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${diff.bg} ${diff.text} ${diff.border}`}>
            {problem.difficulty}
          </span>
          <Badge variant="indigo" className="text-xs px-3 py-1">{problem.category}</Badge>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{problem.title}</h1>

        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {problem.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-slate-800/90 px-2.5 py-1 text-xs font-semibold text-slate-300 border border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Problem Statement Body */}
      <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-200 mt-5 space-y-4 font-sans">
        <div className="whitespace-pre-line break-words text-slate-200 leading-relaxed font-normal">{problem.description}</div>
      </div>

      {/* Hints & AI Assistant Collapsible Section */}
      {problem.hints && problem.hints.length > 0 && (
        <div className="mt-8 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Problem Hints ({problem.hints.length})</span>
              {showHints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {onRequestHint && (
              <button
                onClick={onRequestHint}
                className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask AI for Hint
              </button>
            )}
          </div>

          {showHints && (
            <div className="space-y-3 mt-3">
              {problem.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-200 flex gap-3 items-start leading-relaxed"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/30 text-xs font-bold text-amber-300">
                    {idx + 1}
                  </span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
