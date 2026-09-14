"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDuration, formatDate, getDifficultyColor } from "@/lib/utils";
import { History, Play, FileText } from "lucide-react";

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
    <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-xl">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-white">
            <History className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            Recent Interview Sessions
          </CardTitle>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition-colors ${
                filter === "all" ? "bg-slate-900 border border-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({interviews.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition-colors ${
                filter === "completed" ? "bg-slate-900 border border-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Completed ({interviews.filter((i) => i.status === "completed").length})
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition-colors ${
                filter === "in_progress" ? "bg-slate-900 border border-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              In Progress ({interviews.filter((i) => i.status === "in_progress").length})
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400">
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Problem Title</th>
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Focus & Difficulty</th>
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Language</th>
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Score</th>
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Duration</th>
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Date</th>
                  <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => {
                  const diff = getDifficultyColor(item.difficulty);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-3.5 pr-3 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
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

                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${diff.bg} ${diff.text} ${diff.border}`}>
                            {item.difficulty}
                          </span>
                          <span className="text-[11px] text-slate-300 font-medium">{item.interviewType}</span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3 text-slate-200 capitalize font-mono text-xs font-semibold">
                        {item.language}
                      </td>

                      <td className="py-3.5 pr-3 font-mono font-bold text-xs sm:text-sm">
                        {item.score !== undefined ? (
                          <span className={item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-indigo-400" : "text-amber-400"}>
                            {item.score}/100
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">-</span>
                        )}
                      </td>

                      <td className="py-3.5 pr-3 text-slate-300 font-mono text-xs">
                        {formatDuration(item.durationSeconds || 0)}
                      </td>

                      <td className="py-3.5 pr-3 text-slate-400 text-xs">
                        {formatDate(item.startedAt)}
                      </td>

                      <td className="py-3.5 text-right">
                        {item.status === "completed" ? (
                          <Link href={`/interview/report/${item.id}`}>
                            <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-semibold px-2.5 py-1 border-slate-800 bg-slate-900/60 hover:bg-slate-800">
                              <FileText className="h-3 w-3 text-indigo-400" />
                              View Report
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/interview/${item.id}`}>
                            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20">
                              <Play className="h-3 w-3 fill-white" />
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
          <div className="py-10 text-center text-slate-400 space-y-2.5">
            <History className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No interview sessions found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start your first practice session to generate full AI transcripts and evaluation reports.
            </p>
            <Link href="/interview/setup" className="inline-block pt-1">
              <Button variant="primary" size="sm" className="text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                Start an Interview
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
