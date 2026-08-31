"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDuration, formatDate, getDifficultyColor } from "@/lib/utils";
import { History, Play, FileText, ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface InterviewHistoryItem {
  id: string;
  jobRole: string;
  difficulty: string;
  interviewType: string;
  language: string;
  problemTitle: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string | Date;
  durationSeconds?: number;
  score?: number;
}

interface InterviewHistoryProps {
  interviews: InterviewHistoryItem[];
}

export function InterviewHistoryTable({ interviews }: InterviewHistoryProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "in_progress">("all");

  const filtered = interviews.filter((i) => {
    if (filter === "all") return true;
    return i.status === filter;
  });

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
            <History className="h-5 w-5 text-indigo-400" />
            Recent Interview Sessions
          </CardTitle>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs sm:text-sm">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${
                filter === "all" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({interviews.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${
                filter === "completed" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Completed ({interviews.filter((i) => i.status === "completed").length})
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${
                filter === "in_progress" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              In Progress ({interviews.filter((i) => i.status === "in_progress").length})
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300">
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider">Problem Title</th>
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider">Focus & Difficulty</th>
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider">Language</th>
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider">Score</th>
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider">Duration</th>
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider">Date</th>
                  <th className="pb-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((item) => {
                  const diff = getDifficultyColor(item.difficulty);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-4 pr-3 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                              item.status === "completed"
                                ? "bg-emerald-400"
                                : item.status === "in_progress"
                                ? "bg-amber-400"
                                : "bg-slate-500"
                            }`}
                          />
                          <span className="line-clamp-1">{item.problemTitle}</span>
                        </div>
                      </td>

                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${diff.bg} ${diff.text} ${diff.border}`}>
                            {item.difficulty}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">{item.interviewType}</span>
                        </div>
                      </td>

                      <td className="py-4 pr-3 text-slate-200 capitalize font-mono text-xs sm:text-sm font-semibold">
                        {item.language}
                      </td>

                      <td className="py-4 pr-3 font-mono font-black text-sm sm:text-base">
                        {item.score !== undefined ? (
                          <span className={item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-indigo-400" : "text-amber-400"}>
                            {item.score}/100
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">-</span>
                        )}
                      </td>

                      <td className="py-4 pr-3 text-slate-300 font-mono text-xs sm:text-sm">
                        {formatDuration(item.durationSeconds || 0)}
                      </td>

                      <td className="py-4 pr-3 text-slate-300 text-xs sm:text-sm">
                        {formatDate(item.startedAt)}
                      </td>

                      <td className="py-4 text-right">
                        {item.status === "completed" ? (
                          <Link href={`/interview/report/${item.id}`}>
                            <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-bold">
                              <FileText className="h-3.5 w-3.5 text-indigo-400" />
                              View Report
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/interview/${item.id}`}>
                            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold shadow-indigo-600/25">
                              <Play className="h-3.5 w-3.5 fill-white" />
                              Resume
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <History className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-300">No interview sessions found</p>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Start your first practice session to generate full AI transcripts and evaluation reports.
            </p>
            <Link href="/interview/setup">
              <Button variant="primary" size="sm" className="mt-2 text-sm font-bold">
                Start an Interview
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
