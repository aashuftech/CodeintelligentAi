"use client";

import React from "react";
import Link from "next/link";
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
  ArrowRight,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Bot className="h-7 w-7 text-indigo-400" />,
      title: "Conversational AI Interviewer",
      description:
        "Simulates a Lead Technical Interviewer asking clarifying questions, probing Big-O complexity, and providing progressive 3-tiered hints.",
    },
    {
      icon: <Terminal className="h-7 w-7 text-emerald-400" />,
      title: "Production Monaco IDE",
      description:
        "Full-featured browser code editor with syntax highlighting, custom test inputs, font resizing, and keyboard shortcuts.",
    },
    {
      icon: <Cpu className="h-7 w-7 text-cyan-400" />,
      title: "Sandboxed Code Execution",
      description:
        "Real containerized execution across Python, JavaScript, TypeScript, Java, C++, and Go with CPU, memory, and timeout caps.",
    },
    {
      icon: <Award className="h-7 w-7 text-amber-400" />,
      title: "6-Dimension Rubric Scoring",
      description:
        "Evaluates Test Correctness, Code Quality, Algorithmic Big-O Efficiency, Edge Cases, Problem Solving, and Communication.",
    },
    {
      icon: <BarChart3 className="h-7 w-7 text-purple-400" />,
      title: "Skill Progression Analytics",
      description:
        "Track your performance over time with competency matrices, historical score curves, and personalized topic roadmaps.",
    },
    {
      icon: <ShieldCheck className="h-7 w-7 text-rose-400" />,
      title: "Curated Problem Bank",
      description:
        "Extensive collection of DSA, System Design, Bug Fixing, and Refactoring challenges with comprehensive test suites.",
    },
  ];

  const languages = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-sm font-semibold text-indigo-300 mb-8 backdrop-blur-md shadow-lg shadow-indigo-950/40">
            <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            <span>Powered by Next.js 15, Monaco IDE & Gemini 3.7 Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Master Your Next <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Technical Coding Interview
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Experience realistic technical interviews with an intelligent AI interviewer that listens, provides progressive hints, executes your code in sandboxes, and delivers multi-dimensional scorecards.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/interview/setup">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base sm:text-lg font-bold gap-2.5 px-8 py-4 shadow-indigo-600/30">
                <Play className="h-5 w-5 fill-white" />
                Start Live Interview
              </Button>
            </Link>
            <Link href="/problems">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg font-bold gap-2.5 px-8 py-4">
                <Code2 className="h-5 w-5" />
                Explore Problem Bank
              </Button>
            </Link>
          </div>

          {/* Supported Languages Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 text-sm text-slate-300">
            <span className="font-bold text-white mr-2 text-sm sm:text-base">Supported Environments:</span>
            {languages.map((lang, idx) => (
              <span
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-1.5 font-mono font-semibold text-slate-200 shadow-sm"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Interactive Workspace Preview Mockup */}
          <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl max-w-6xl mx-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 px-2">
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-full bg-rose-500/80" />
                <span className="h-3.5 w-3.5 rounded-full bg-amber-500/80" />
                <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs sm:text-sm font-mono font-semibold text-slate-300">
                  interview_workspace.py — Senior Backend Engineer
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" className="text-xs px-2.5 py-0.5">All Tests Passed</Badge>
                <span className="text-sm font-mono text-emerald-400 font-bold">Score: 94/100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Problem & AI Dialog */}
              <div className="lg:col-span-5 rounded-2xl bg-slate-950 p-5 border border-slate-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-bold text-base sm:text-lg text-white">1. Two Sum Target</span>
                    <Badge variant="warning" className="text-xs">Medium</Badge>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    Given an array of integers <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">nums</code> and an integer <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm">
                    <Bot className="h-4 w-4" /> AI Interviewer
                  </div>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                    "Excellent use of the Hash Map for \(O(N)\) time complexity! How would your approach change if the array were sorted?"
                  </p>
                </div>
              </div>

              {/* Center Column: Monaco Code Editor */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-950 p-5 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                <div className="text-slate-500">// Optimal Solution in Python 3</div>
                <div className="mt-2 text-indigo-400">def <span className="text-blue-400">two_sum</span>(nums: List[int], target: int) -&gt; List[int]:</div>
                <div className="ml-4 text-slate-300">seen = {}</div>
                <div className="ml-4 text-purple-400">for <span className="text-slate-200">i, num</span> in <span className="text-yellow-400">enumerate</span>(nums):</div>
                <div className="ml-8 text-slate-300">complement = target - num</div>
                <div className="ml-8 text-purple-400">if <span className="text-slate-200">complement</span> in <span className="text-slate-300">seen</span>:</div>
                <div className="ml-12 text-emerald-400">return [seen[complement], i]</div>
                <div className="ml-8 text-slate-300">seen[num] = i</div>
                <div className="ml-4 text-purple-400">return []</div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-sans text-slate-300 font-medium">
                  <span>Runtime: <strong className="text-emerald-400 font-mono">12ms</strong> (Faster than 96%)</span>
                  <span>Memory: <strong className="text-indigo-400 font-mono">14.2 MB</strong> (\(O(N)\) Space)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-5xl">
              Everything You Need for Interview Mastery
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-normal">
              Engineered like a real-world technical assessment platform at top tech organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <Card key={idx} className="border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950 transition-all p-2 shadow-lg">
                <CardContent className="p-6 sm:p-7 space-y-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{feat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
