"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { formatDuration, formatDate, getDifficultyColor } from "@/lib/utils";
import {
  Trophy,
  Award,
  Zap,
  Code,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  Check,
} from "lucide-react";

export default function InterviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/interview/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load interview report");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Generating evaluation scorecard...</span>
        </div>
      </div>
    );
  }

  if (error || !data?.evaluation) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 text-center max-w-md space-y-4 shadow-xl">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Evaluation Report Pending</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            This interview session is still in progress or has not been evaluated yet.
          </p>
          <div className="flex items-center justify-center gap-2.5 pt-2">
            <Link href={`/interview/${id}`}>
              <Button variant="primary" size="sm" className="text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                Resume Interview
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm font-semibold border-slate-800 bg-slate-900/50">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { interview, evaluation } = data;
  const problem = interview.problemId;
  const metrics = evaluation.metrics;
  const overallScore = evaluation.overallScore || 0;

  const scoreColor =
    overallScore >= 85
      ? "text-emerald-400"
      : overallScore >= 70
      ? "text-indigo-400"
      : overallScore >= 50
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-white font-semibold">Evaluation Report</span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-200">
              <LayoutDashboard className="h-4 w-4 text-slate-400" /> Dashboard
            </Button>
          </Link>
          <Link href="/interview/setup">
            <Button variant="primary" size="sm" className="gap-2 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/25">
              <RotateCcw className="h-4 w-4" /> Practice Another
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Score Header Card */}
      <Card className="border-slate-800/80 bg-slate-900/60 p-5 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo" className="text-xs px-2.5 py-0.5 font-semibold">{interview.jobRole}</Badge>
              <Badge variant="secondary" className="capitalize text-xs px-2.5 py-0.5 font-semibold">{interview.experienceLevel} Level</Badge>
              <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
                {interview.language.toUpperCase()}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Evaluation: {problem?.title || "Coding Challenge"}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-400 font-sans">
              <span>Conducted: <strong className="text-slate-200">{formatDate(interview.startedAt)}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-slate-200">{formatDuration(interview.durationSeconds || 0)}</strong></span>
              <span>•</span>
              <span>Tests: <strong className="text-emerald-400 font-mono">{evaluation.passedTests}/{evaluation.totalTests} Passed</strong></span>
            </div>
          </div>

          {/* Large Overall Score Circle */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 min-w-[170px] shadow-lg text-center shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overall Score</span>
            <div className={`text-4.5xl sm:text-5.5xl font-black font-mono my-1 ${scoreColor}`}>
              {overallScore}
            </div>
            <span className="text-xs text-slate-300 font-medium">
              {overallScore >= 85
                ? "Strong Hire Candidate"
                : overallScore >= 70
                ? "Qualified Candidate"
                : "Needs Additional Practice"}
            </span>
          </div>
        </div>
      </Card>

      {/* 6-Dimensional Metric Breakdown Matrix */}
      <div className="space-y-4 sm:space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-400" />
          Competency Evaluation Rubric
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. Test Correctness */}
          <Card className="border-slate-800/80 bg-slate-900/60 p-1 shadow-lg">
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Test Correctness
                </CardTitle>
                <span className="font-mono font-bold text-xs sm:text-sm text-emerald-400">
                  {metrics.testCorrectness?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ProgressBar value={metrics.testCorrectness?.score ?? 0} color="emerald" className="h-2" />
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {metrics.testCorrectness?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 2. Code Quality */}
          <Card className="border-slate-800/80 bg-slate-900/60 p-1 shadow-lg">
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Code className="h-4 w-4 text-indigo-400" />
                  Code Quality & Cleanliness
                </CardTitle>
                <span className="font-mono font-bold text-xs sm:text-sm text-indigo-400">
                  {metrics.codeQuality?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ProgressBar value={metrics.codeQuality?.score ?? 0} color="indigo" className="h-2" />
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {metrics.codeQuality?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 3. Algorithmic Efficiency */}
          <Card className="border-slate-800/80 bg-slate-900/60 p-1 shadow-lg">
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Algorithmic Efficiency
                </CardTitle>
                <span className="font-mono font-bold text-xs sm:text-sm text-amber-400">
                  {metrics.algorithmicEfficiency?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ProgressBar value={metrics.algorithmicEfficiency?.score ?? 0} color="amber" className="h-2" />
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-0.5">
                <span>Time: <strong className="text-white">{metrics.algorithmicEfficiency?.detectedTimeComplexity || "O(N)"}</strong></span>
                <span>Space: <strong className="text-white">{metrics.algorithmicEfficiency?.detectedSpaceComplexity || "O(1)"}</strong></span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {metrics.algorithmicEfficiency?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 4. Edge Cases */}
          <Card className="border-slate-800/80 bg-slate-900/60 p-1 shadow-lg">
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-sky-400" />
                  Edge Case Handling
                </CardTitle>
                <span className="font-mono font-bold text-xs sm:text-sm text-sky-400">
                  {metrics.edgeCases?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ProgressBar value={metrics.edgeCases?.score ?? 0} color="indigo" className="h-2" />
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {metrics.edgeCases?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 5. Problem Solving */}
          <Card className="border-slate-800/80 bg-slate-900/60 p-1 shadow-lg">
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  Problem Solving Approach
                </CardTitle>
                <span className="font-mono font-bold text-xs sm:text-sm text-indigo-400">
                  {metrics.problemSolving?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ProgressBar value={metrics.problemSolving?.score ?? 0} color="indigo" className="h-2" />
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {metrics.problemSolving?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 6. Communication */}
          <Card className="border-slate-800/80 bg-slate-900/60 p-1 shadow-lg">
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-sky-400" />
                  Technical Communication
                </CardTitle>
                <span className="font-mono font-bold text-xs sm:text-sm text-sky-400">
                  {metrics.communication?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ProgressBar value={metrics.communication?.score ?? 0} color="indigo" className="h-2" />
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {metrics.communication?.feedback}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actionable Feedback: Strengths vs Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Strengths */}
        <Card className="border-emerald-500/20 bg-slate-900/60 p-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Candidate Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            {evaluation.strengths?.map((str: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <span className="leading-relaxed">{str}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="border-amber-500/20 bg-slate-900/60 p-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            {evaluation.weaknesses?.map((wk: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mt-0.5">
                  <span className="text-xs font-bold font-mono">•</span>
                </div>
                <span className="leading-relaxed">{wk}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Code Comparison Section: Candidate vs Optimal Solution */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Code className="h-5 w-5 text-indigo-400" />
          Code Solution Review
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Candidate Code */}
          <Card className="border-slate-800/80 bg-slate-950 p-2 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-200">Candidate Submission</span>
                <span className="text-xs font-mono text-slate-400 uppercase">{interview.language}</span>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[400px]">
                {interview.currentCode || "// No code submitted"}
              </pre>
            </CardContent>
          </Card>

          {/* Reference Optimal Solution */}
          <Card className="border-slate-800/80 bg-slate-950 p-2 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Optimal Reference Solution
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase">{interview.language}</span>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[400px]">
                {problem?.starterCode?.[interview.language] || "// Reference solution"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
