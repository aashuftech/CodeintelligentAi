"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreAnalyticsPanel } from "@/components/dashboard/score-chart";
import { InterviewHistoryTable } from "@/components/dashboard/interview-history";
import { RecommendedTopicsCard } from "@/components/dashboard/recommendations";
import {
  Trophy,
  Code2,
  Clock,
  Target,
  Play,
  TrendingUp,
  Layers,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Loading candidate analytics...</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    problemsSolved: 0,
    targetRole: "Full Stack Engineer",
    experienceLevel: "mid",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 border-b border-slate-800/80 pb-6 sm:pb-7">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight">Candidate Dashboard</h1>
            <Badge variant="indigo" className="text-xs px-2.5 py-0.5 font-semibold">{stats.targetRole}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Track your live interview performance, algorithm complexity mastery, and AI recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link href="/problems" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 text-xs sm:text-sm font-semibold px-4 py-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-slate-200">
              <BookOpen className="h-4 w-4 text-slate-400" /> Problem Bank
            </Button>
          </Link>
          <Link href="/interview/setup" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-2 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/25">
              <Play className="h-4 w-4 fill-white" /> Start New Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Overall Score */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
              <div className="text-2.5xl sm:text-3.5xl font-black text-white font-mono flex items-baseline gap-1">
                <span className={stats.averageScore >= 80 ? "text-emerald-400" : stats.averageScore >= 60 ? "text-indigo-400" : "text-amber-400"}>
                  {stats.averageScore}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-normal font-sans">/100</span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Based on {stats.completedInterviews} completed interviews</span>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm">
              <Trophy className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>

        {/* Total Sessions */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews Taken</span>
              <div className="text-2.5xl sm:text-3.5xl font-black text-white font-mono">{stats.totalInterviews}</div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">{stats.completedInterviews} completed, {stats.totalInterviews - stats.completedInterviews} in progress</span>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
              <Layers className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>

        {/* Problems Solved */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passed Submissions</span>
              <div className="text-2.5xl sm:text-3.5xl font-black text-white font-mono text-emerald-400">{stats.problemsSolved}</div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Verified by containerized test runner</span>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-sky-600/20 text-sky-400 border border-sky-500/30 shadow-sm">
              <Code2 className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>

        {/* Seniority Level Target */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Level</span>
              <div className="text-xl sm:text-2.5xl font-extrabold text-white capitalize tracking-tight">{stats.experienceLevel} Level</div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">{stats.targetRole}</span>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm">
              <Target className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts (Skill Matrix & Score Trend) */}
      <ScoreAnalyticsPanel
        skills={data?.skills || []}
        scoreHistory={data?.scoreHistory || []}
        averageScore={stats.averageScore}
      />

      {/* AI Recommendations */}
      <RecommendedTopicsCard
        topics={data?.recommendedTopics || []}
        targetRole={stats.targetRole}
      />

      {/* Recent Interviews Table */}
      <InterviewHistoryTable interviews={data?.recentInterviews || []} />
    </div>
  );
}
