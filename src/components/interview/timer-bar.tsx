"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatDuration, getDifficultyColor } from "@/lib/utils";
import { Clock, ArrowLeft, CheckCircle, ShieldAlert, Sparkles, Terminal } from "lucide-react";

interface TimerBarProps {
  jobRole: string;
  difficulty: string;
  startedAt: string | Date;
  onFinishInterview: () => void;
  isEvaluating?: boolean;
}

export function InterviewTimerBar({
  jobRole,
  difficulty,
  startedAt,
  onFinishInterview,
  isEvaluating = false,
}: TimerBarProps) {
  const [seconds, setSeconds] = useState(0);
  const diffStyle = getDifficultyColor(difficulty);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setSeconds(Math.max(0, elapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950 px-2.5 sm:px-6 shrink-0">
      {/* Left: Back Link & Role */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 rounded-lg p-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Exit to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Exit</span>
        </Link>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white max-w-[120px] sm:max-w-none truncate">{jobRole}</span>
          <span className={`rounded-md border px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Center: Live Timer with Recording indicator */}
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 sm:px-3.5 py-1 text-xs font-mono">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
        <span className="text-slate-200 font-bold">{formatDuration(seconds)}</span>
      </div>

      {/* Right: End & Finish Interview Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={onFinishInterview}
          isLoading={isEvaluating}
          className="gap-1 sm:gap-1.5 rounded-xl text-xs py-1 sm:py-1.5 px-2.5 sm:px-3"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Finish & Evaluate</span>
          <span className="sm:hidden">Finish</span>
        </Button>
      </div>
    </div>
  );
}
