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
  ArrowRight,
  RotateCcw,
  LayoutDashboard,
  Check,
  Layers,
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
        <div className="flex items-center gap-3 text-slate-300 text-base">
          <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Generating multi-dimensional evaluation report...</span>
        </div>
      </div>
    );
  }

  if (error || !data?.evaluation) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center max-w-md space-y-4 shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Evaluation Report Pending</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            This interview session is still in progress or has not been evaluated yet.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href={`/interview/${id}`}>
              <Button variant="primary" size="sm">Resume Interview</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { interview, evaluation, submissions } = data;
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-white font-semibold">Interview Evaluation Report</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2 text-sm font-semibold px-4 py-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/interview/setup">
            <Button variant="primary" size="sm" className="gap-2 text-sm font-semibold px-4 py-2 shadow-indigo-600/30">
              <RotateCcw className="h-4 w-4" /> Practice Another
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Score Header Card */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-9 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="indigo" className="text-xs sm:text-sm px-3 py-1 font-bold">{interview.jobRole}</Badge>
              <Badge variant="secondary" className="capitalize text-xs sm:text-sm px-3 py-1 font-bold">{interview.experienceLevel} Level</Badge>
              <span className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-mono font-bold text-slate-200">
                {interview.language.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Evaluation: {problem?.title || "Coding Challenge"}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-300 font-sans">
              <span>Conducted: <strong className="text-white">{formatDate(interview.startedAt)}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-white">{formatDuration(interview.durationSeconds || 0)}</strong></span>
              <span>•</span>
              <span>Tests: <strong className="text-emerald-400">{evaluation.passedTests}/{evaluation.totalTests} Passed</strong></span>
            </div>
          </div>

          {/* Large Overall Score Circle */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/90 p-7 min-w-[200px] shadow-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Score</span>
            <div className={`text-6xl font-black font-mono my-2 ${scoreColor}`}>
              {overallScore}
            </div>
            <span className="text-sm text-slate-300 font-semibold">
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
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <Award className="h-6 w-6 text-indigo-400" />
          Competency Evaluation Rubric
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Test Correctness */}
          <Card className="border-slate-800 bg-slate-950/70 p-1 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Test Correctness
                </CardTitle>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {metrics.testCorrectness?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={metrics.testCorrectness?.score ?? 0} color="emerald" />
              <p className="text-slate-300 leading-relaxed text-sm">
                {metrics.testCorrectness?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 2. Code Quality */}
          <Card className="border-slate-800 bg-slate-950/70 p-1 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-indigo-400" />
                  Code Quality & Cleanliness
                </CardTitle>
                <span className="font-mono font-bold text-sm text-indigo-400">
                  {metrics.codeQuality?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={metrics.codeQuality?.score ?? 0} color="indigo" />
              <p className="text-slate-300 leading-relaxed text-sm">
                {metrics.codeQuality?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 3. Algorithmic Efficiency */}
          <Card className="border-slate-800 bg-slate-950/70 p-1 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Algorithmic Efficiency
                </CardTitle>
                <span className="font-mono font-bold text-sm text-amber-400">
                  {metrics.algorithmicEfficiency?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={metrics.algorithmicEfficiency?.score ?? 0} color="amber" />
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-200 pt-1">
                <span>Time: <strong>{metrics.algorithmicEfficiency?.detectedTimeComplexity || "O(N)"}</strong></span>
                <span>Space: <strong>{metrics.algorithmicEfficiency?.detectedSpaceComplexity || "O(1)"}</strong></span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                {metrics.algorithmicEfficiency?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 4. Edge Cases */}
          <Card className="border-slate-800 bg-slate-950/70 p-1 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />
                  Edge Case Handling
                </CardTitle>
                <span className="font-mono font-bold text-sm text-cyan-400">
                  {metrics.edgeCases?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={metrics.edgeCases?.score ?? 0} color="indigo" />
              <p className="text-slate-300 leading-relaxed text-sm">
                {metrics.edgeCases?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 5. Problem Solving */}
          <Card className="border-slate-800 bg-slate-950/70 p-1 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Problem Solving Approach
                </CardTitle>
                <span className="font-mono font-bold text-sm text-purple-400">
                  {metrics.problemSolving?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={metrics.problemSolving?.score ?? 0} color="indigo" />
              <p className="text-slate-300 leading-relaxed text-sm">
                {metrics.problemSolving?.feedback}
              </p>
            </CardContent>
          </Card>

          {/* 6. Communication */}
          <Card className="border-slate-800 bg-slate-950/70 p-1 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  Technical Communication
                </CardTitle>
                <span className="font-mono font-bold text-sm text-blue-400">
                  {metrics.communication?.score ?? 0}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={metrics.communication?.score ?? 0} color="indigo" />
              <p className="text-slate-300 leading-relaxed text-sm">
                {metrics.communication?.feedback}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-emerald-500/30 bg-emerald-950/15 p-1 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Key Strengths Observed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm text-slate-200">
            {evaluation.strengths?.map((str: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card className="border-amber-500/30 bg-amber-950/15 p-1 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm text-slate-200">
            {evaluation.weaknesses?.map((wk: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{wk}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actionable Suggestions & Recommended Topics */}
      <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Actionable Next Steps & Study Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          {evaluation.actionableSuggestions && evaluation.actionableSuggestions.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-200 text-sm">Targeted Feedback:</span>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 leading-relaxed">
                {evaluation.actionableSuggestions.map((sug: string, idx: number) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.recommendedTopics && evaluation.recommendedTopics.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80">
              <span className="font-bold text-slate-200 block mb-3 text-sm">Recommended Study Topics:</span>
              <div className="flex flex-wrap gap-2.5">
                {evaluation.recommendedTopics.map((topic: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-1.5 text-sm font-bold text-indigo-300 shadow-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submitted Code vs Optimal Reference Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Submitted Code */}
        <Card className="border-slate-800 bg-slate-950 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Code className="h-5 w-5 text-slate-400" />
              Your Submitted Code ({interview.language})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-2xl bg-slate-900/90 p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto max-h-[350px] leading-relaxed border border-slate-800/80">
              {interview.currentCode}
            </pre>
          </CardContent>
        </Card>

        {/* Optimal Solution Snippet */}
        <Card className="border-slate-800 bg-slate-950 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Optimal Reference Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-2xl bg-slate-900/90 p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto max-h-[350px] leading-relaxed border border-slate-800/80">
              {evaluation.optimalSolutionSnippet || "// Optimal pattern reference is based on standard library benchmarks"}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
