"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Sparkles,
  Play,
  Check,
  ArrowRight,
} from "lucide-react";

function SetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProblemId = searchParams.get("problemId");

  const [jobRole, setJobRole] = useState("Full Stack Engineer");
  const [experienceLevel, setExperienceLevel] = useState<"junior" | "mid" | "senior" | "lead">("mid");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [interviewType, setInterviewType] = useState<"DSA" | "SystemDesign" | "BugFix" | "Refactoring" | "Practical">("DSA");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { id: "Full Stack Engineer", label: "Full Stack Engineer", desc: "Balanced DSA, async logic, and state manipulation" },
    { id: "Backend Engineer", label: "Backend Engineer", desc: "Data processing, algorithms, memory, and complexity" },
    { id: "Frontend Engineer", label: "Frontend Engineer", desc: "Tree/DOM transformations, algorithms, and performance" },
    { id: "Systems Engineer", label: "Systems Engineer", desc: "Low-level memory, concurrency, pointers, and C++/Go" },
    { id: "DevOps & Cloud Engineer", label: "DevOps & Cloud Engineer", desc: "Scripting, pipelines, system reliability, and automation" },
    { id: "Data / ML Engineer", label: "Data / ML Engineer", desc: "Matrix operations, pipelines, and algorithmic efficiency" },
  ];

  const difficulties = [
    { id: "easy", label: "Easy", color: "text-emerald-400", desc: "Fundamentals, basic lookups & simple loops" },
    { id: "medium", label: "Medium", color: "text-amber-400", desc: "Hash maps, two pointers, trees, graphs, DP" },
    { id: "hard", label: "Hard", color: "text-rose-400", desc: "Advanced graphs, complex DP, concurrency, hard constraints" },
  ];

  const types = [
    { id: "DSA", label: "Data Structures & Algorithms", desc: "Classic algorithmic problems, Big-O analysis & optimizations" },
    { id: "SystemDesign", label: "System & Architecture Design", desc: "High-level architecture, scalability, trade-offs & data models" },
    { id: "BugFix", label: "Bug Investigation & Debugging", desc: "Locate and fix defects, edge cases, and runtime exceptions" },
    { id: "Refactoring", label: "Code Refactoring & Quality", desc: "Transform messy code into clean, modular, extensible architecture" },
  ];

  const languages = [
    { id: "python", name: "Python 3", tag: "Dynamic & Fast" },
    { id: "javascript", name: "JavaScript", tag: "Web & Async" },
    { id: "typescript", name: "TypeScript", tag: "Strict Types" },
    { id: "java", name: "Java 17", tag: "Enterprise" },
    { id: "cpp", name: "C++ 20", tag: "High Performance" },
    { id: "go", name: "Go 1.22", tag: "Concurrent" },
  ];

  const handleStartInterview = async () => {
    setIsLoading(true);
    setError("");

    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();
      if (!authData.user) {
        router.push("/register");
        return;
      }

      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole,
          experienceLevel,
          difficulty,
          interviewType,
          language,
          problemId: preselectedProblemId || undefined,
        }),
      });

      if (res.status === 401) {
        router.push("/register");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize interview");
      }

      router.push(`/interview/${data.interviewId}`);
    } catch (err: any) {
      setError(err.message || "Failed to start interview. Please ensure you are logged in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      <div className="text-center space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/90 bg-slate-900/80 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Interactive Setup Wizard</span>
        </div>
        <h1 className="text-2.5xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Configure Your Practice Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tailor your simulation parameters. The AI interviewer will adjust question difficulty and follow-ups accordingly.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => router.push("/login")} className="text-xs">
            Sign In
          </Button>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {/* Step 1: Select Target Role & Seniority */}
        <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-white">
              <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20">
                1
              </span>
              Target Job Role & Seniority Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setJobRole(r.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition-all ${
                    jobRole === r.id
                      ? "border-indigo-500 bg-indigo-600/15 text-white ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950/30"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-white">{r.label}</span>
                    {jobRole === r.id && <Check className="h-4 w-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2.5">Seniority Tier:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  { id: "junior", label: "Junior", exp: "0-2 Years" },
                  { id: "mid", label: "Mid-Level", exp: "3-5 Years" },
                  { id: "senior", label: "Senior", exp: "6+ Years" },
                  { id: "lead", label: "Staff / Lead", exp: "8+ Years" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id as any)}
                    className={`rounded-xl border p-2.5 sm:p-3 text-center transition-all ${
                      experienceLevel === lvl.id
                        ? "border-indigo-500 bg-indigo-600/20 text-white font-bold ring-1 ring-indigo-500/50 shadow-sm"
                        : "border-slate-800/80 bg-slate-950/80 text-slate-300 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-white">{lvl.label}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{lvl.exp}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Difficulty & Focus */}
        <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-white">
              <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20">
                2
              </span>
              Difficulty & Interview Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {difficulties.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDifficulty(d.id as any)}
                  className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition-all ${
                    difficulty === d.id
                      ? `bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950/30`
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm sm:text-base font-bold ${d.color}`}>{d.label}</span>
                    {difficulty === d.id && <Check className="h-4 w-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-slate-800/80">
              {types.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setInterviewType(t.id as any)}
                  className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition-all ${
                    interviewType === t.id
                      ? "border-indigo-500 bg-indigo-600/15 text-white ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950/30"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-white">{t.label}</span>
                    {interviewType === t.id && <Check className="h-4 w-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Programming Language */}
        <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-white">
              <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20">
                3
              </span>
              Programming Language
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
              {languages.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.id)}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    language === l.id
                      ? "border-indigo-500 bg-indigo-600/20 text-white font-bold ring-1 ring-indigo-500 shadow-sm"
                      : "border-slate-800/80 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-mono font-bold text-white">{l.name}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">{l.tag}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Launch CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left leading-relaxed">
            Interview session will open in full-screen IDE mode with real-time AI conversation and test harnesses.
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={handleStartInterview}
            isLoading={isLoading}
            className="w-full sm:w-auto text-sm sm:text-base font-bold gap-2 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/25 shrink-0"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Launch Interview Room</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InterviewSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center text-slate-300 text-sm">
        Loading interview configuration...
      </div>
    }>
      <SetupForm />
    </Suspense>
  );
}
