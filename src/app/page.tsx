"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Terminal,
  Bot,
  Cpu,
  Award,
  Sparkles,
  Play,
  Code2,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLiveInterview = async () => {
    setIsStarting(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        router.push("/interview/setup");
      } else {
        router.push("/register");
      }
    } catch {
      router.push("/register");
    } finally {
      setIsStarting(false);
    }
  };

  const features = [
    {
      icon: <Bot className="h-6 w-6 text-indigo-400" />,
      title: "Conversational AI Interviewer",
      description:
        "Simulates a Lead Technical Interviewer asking clarifying questions, probing Big-O complexity, and providing progressive 3-tiered hints.",
    },
    {
      icon: <Terminal className="h-6 w-6 text-emerald-400" />,
      title: "Production Monaco IDE",
      description:
        "Full-featured browser code editor with syntax highlighting, custom test inputs, font resizing, and keyboard shortcuts.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-sky-400" />,
      title: "Sandboxed Code Execution",
      description:
        "Real containerized execution across Python, JavaScript, TypeScript, Java, C++, and Go with CPU, memory, and timeout caps.",
    },
    {
      icon: <Award className="h-6 w-6 text-amber-400" />,
      title: "6-Dimension Rubric Scoring",
      description:
        "Evaluates Test Correctness, Code Quality, Algorithmic Big-O Efficiency, Edge Cases, Problem Solving, and Communication.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-400" />,
      title: "Skill Progression Analytics",
      description:
        "Track your performance over time with competency matrices, historical score curves, and personalized topic roadmaps.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-teal-400" />,
      title: "Curated Problem Bank",
      description:
        "Extensive collection of DSA, System Design, Bug Fixing, and Refactoring challenges with comprehensive test suites.",
    },
  ];

  const languages = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go"];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        {/* Soft Ambient Glows (Decent & Eye-friendly) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] sm:h-[450px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Decorative Dot Matrix Grid (As shown in reference image) */}
        <div className="absolute top-12 right-6 sm:right-16 w-36 h-36 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40 pointer-events-none hidden md:block" />
        <div className="absolute bottom-16 left-6 sm:left-16 w-36 h-36 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40 pointer-events-none hidden md:block" />

        {/* Floating Illustration Left (Code Window Mockup - Desktop) */}
        <div className="absolute left-4 xl:left-12 top-28 xl:top-36 hidden lg:block pointer-events-none select-none z-10">
          <div className="text-slate-500 font-serif italic text-sm mb-3 ml-2 transform -rotate-6">
            Practice<br />Improve<br />Succeed
          </div>
          <div className="w-56 xl:w-64 rounded-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-md p-3.5 shadow-2xl shadow-slate-950/80 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-800/80 mb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-3/4 bg-slate-800 rounded" />
              <div className="h-2 w-1/2 bg-slate-800/70 rounded ml-2" />
              <div className="h-2 w-4/5 bg-slate-800/80 rounded ml-4" />
              <div className="h-2 w-2/3 bg-indigo-500/40 rounded ml-6" />
              <div className="h-2 w-1/3 bg-slate-800/60 rounded ml-2" />
            </div>
          </div>
        </div>

        {/* Floating Illustration Right (AI Bot Card - Desktop) */}
        <div className="absolute right-4 xl:right-12 top-28 xl:top-36 hidden lg:block pointer-events-none select-none z-10">
          <div className="text-slate-500 font-serif italic text-sm mb-3 text-right mr-2 transform rotate-6">
            AI-Powered<br />Real Feedback
          </div>
          <div className="w-56 xl:w-64 rounded-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-md p-3.5 shadow-2xl shadow-slate-950/80 transform rotate-3 hover:rotate-0 transition-transform duration-300 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Let's solve</p>
                <p className="text-[11px] text-slate-400">this together!</p>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-2 w-full bg-slate-800 rounded" />
              <div className="h-2 w-3/4 bg-slate-800/70 rounded" />
            </div>
          </div>
          <div className="text-slate-500 font-serif italic text-sm mt-12 text-right mr-3 transform -rotate-3">
            Build<br />Confidence
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-20">
          {/* Top Feature Pill (Reference Matched) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/90 bg-slate-900/70 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 mb-6 sm:mb-8 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Powered by Next.js 15, Monaco IDE & Gemini 3.7 Flash</span>
          </div>

          {/* Main Title (Clean White + Soft Gentle Blue/Indigo Gradient) */}
          <h1 className="text-3.5xl sm:text-5.5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl mx-auto">
            Master Your Next <br />
            <span className="bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Technical Coding Interview
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-2.5xl sm:max-w-3xl mx-auto leading-relaxed font-normal">
            Experience realistic technical interviews with an intelligent AI interviewer that listens, provides progressive hints, executes your code in sandboxes, and delivers multi-dimensional scorecards.
          </p>

          {/* Action CTA Buttons (Reference Matched) */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              variant="primary"
              onClick={handleStartLiveInterview}
              isLoading={isStarting}
              className="w-full sm:w-auto text-sm sm:text-base font-bold gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-white" />
              Start Live Interview
            </Button>
            <Link href="/problems" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base font-semibold gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-slate-200 rounded-xl transition-all active:scale-[0.98]"
              >
                <Code2 className="h-4 w-4 text-slate-400" />
                Explore Problem Bank
              </Button>
            </Link>
          </div>

          {/* Supported Environments Pills (Reference Matched) */}
          <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
            <span className="font-semibold text-slate-200 mr-1 sm:mr-2">Supported Environments:</span>
            {languages.map((lang, idx) => (
              <span
                key={idx}
                className="rounded-xl border border-slate-800/90 bg-slate-900/80 px-3 py-1 font-mono font-medium text-slate-300 shadow-sm"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Live Workspace Preview Card Mockup */}
          <div className="mt-14 sm:mt-18 rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-slate-900/70 p-3.5 sm:p-6 shadow-2xl shadow-slate-950/80 backdrop-blur-xl max-w-5xl mx-auto text-left">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 sm:pb-4 mb-4 sm:mb-5 gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs sm:text-sm font-mono font-semibold text-slate-300 truncate max-w-[200px] sm:max-w-none">
                  interview_workspace.py — Senior Backend Engineer
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Badge variant="success" className="text-xs px-2.5 py-0.5">All Tests Passed</Badge>
                <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold">Score: 94/100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
              {/* Left Column: Problem & AI Dialog */}
              <div className="lg:col-span-5 rounded-xl sm:rounded-2xl bg-slate-950 p-4 sm:p-5 border border-slate-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm sm:text-base text-white">1. Two Sum Target</span>
                    <Badge variant="warning" className="text-xs">Medium</Badge>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    Given an array of integers <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">nums</code> and an integer <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm">
                    <Bot className="h-4 w-4" /> AI Interviewer
                  </div>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                    "Excellent use of the Hash Map for \(O(N)\) time complexity! How would your approach change if the array were sorted?"
                  </p>
                </div>
              </div>

              {/* Right Column: Monaco Code Editor */}
              <div className="lg:col-span-7 rounded-xl sm:rounded-2xl bg-slate-950 p-4 sm:p-5 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto">
                <div className="text-slate-500">// Optimal Solution in Python 3</div>
                <div className="mt-2 text-indigo-400">def <span className="text-blue-400">two_sum</span>(nums: List[int], target: int) -&gt; List[int]:</div>
                <div className="ml-4 text-slate-300">seen = {}</div>
                <div className="ml-4 text-purple-400">for <span className="text-slate-200">i, num</span> in <span className="text-yellow-400">enumerate</span>(nums):</div>
                <div className="ml-8 text-slate-300">complement = target - num</div>
                <div className="ml-8 text-purple-400">if <span className="text-slate-200">complement</span> in <span className="text-slate-300">seen</span>:</div>
                <div className="ml-12 text-emerald-400">return [seen[complement], i]</div>
                <div className="ml-8 text-slate-300">seen[num] = i</div>
                <div className="ml-4 text-purple-400">return []</div>

                <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-sans text-slate-300 font-medium gap-2">
                  <span>Runtime: <strong className="text-emerald-400 font-mono">12ms</strong> (Faster than 96%)</span>
                  <span>Memory: <strong className="text-indigo-400 font-mono">14.2 MB</strong> (\(O(N)\) Space)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 sm:py-24 bg-slate-900/30 border-t border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Everything You Need for Interview Mastery
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal">
              Engineered like a real-world technical assessment platform at top tech organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feat, idx) => (
              <Card key={idx} className="border-slate-800/80 bg-slate-900/60 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all p-2 shadow-lg">
                <CardContent className="p-5 sm:p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 shadow-sm">
                    {feat.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{feat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
