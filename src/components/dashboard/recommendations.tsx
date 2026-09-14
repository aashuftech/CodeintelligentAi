"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, Compass } from "lucide-react";

interface RecommendationsProps {
  topics: string[];
  targetRole: string;
}

export function RecommendedTopicsCard({ topics, targetRole }: RecommendationsProps) {
  return (
    <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-white">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            AI-Generated Study Roadmap
          </CardTitle>
          <span className="text-xs sm:text-sm text-indigo-300 font-semibold">{targetRole}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Based on your past interview performance, automated test outcomes, and code complexity analyses, these topics will maximize your technical interview readiness:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-200 hover:border-indigo-500/40 transition-colors shadow-sm"
            >
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs">
                {idx + 1}
              </div>
              <span className="font-semibold text-white">{topic}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Link href="/interview/setup" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-2 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/25">
              <Compass className="h-4 w-4" />
              Practice Recommended Problem
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
