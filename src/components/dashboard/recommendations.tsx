"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, BookOpen, Compass, CheckCircle } from "lucide-react";

interface RecommendationsProps {
  topics: string[];
  targetRole: string;
}

export function RecommendedTopicsCard({ topics, targetRole }: RecommendationsProps) {
  return (
    <Card className="border-indigo-500/30 bg-gradient-to-b from-indigo-950/25 to-slate-900/80 p-2 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
            <Sparkles className="h-5 w-5 text-amber-400" />
            AI-Generated Study Roadmap
          </CardTitle>
          <span className="text-sm text-indigo-300 font-bold">{targetRole}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <p className="text-sm text-slate-300 leading-relaxed">
          Based on your past interview performance, automated test outcomes, and code complexity analyses, these topics will maximize your technical interview readiness:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 hover:border-indigo-500/40 transition-colors shadow-sm"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 font-bold text-xs">
                {idx + 1}
              </div>
              <span className="font-semibold text-white">{topic}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <Link href="/interview/setup">
            <Button variant="primary" size="sm" className="gap-2 text-sm font-bold px-5 py-2.5 shadow-indigo-600/30">
              <Compass className="h-4 w-4" />
              Practice Recommended Problem
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
