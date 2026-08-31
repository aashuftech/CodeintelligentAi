"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/utils";
import {
  BookOpen,
  Search,
  Filter,
  Play,
  CheckCircle2,
  Code2,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function ProblemBankPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty, selectedCategory]);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (search) params.set("search", search);

      const res = await fetch(`/api/problems?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  const filteredProblems = problems.filter((p) => {
    if (!search) return true;
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-800 pb-7">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Curated Problem Bank</h1>
            <Badge variant="indigo" className="text-xs sm:text-sm px-3 py-1 font-bold">{problems.length} Challenges</Badge>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Browse real-world algorithmic, system design, and refactoring interview problems.
          </p>
        </div>

        <Link href="/interview/setup">
          <Button variant="primary" size="sm" className="gap-2 text-sm font-bold px-5 py-2.5 shadow-indigo-600/30">
            <Sparkles className="h-4 w-4" /> Start Random Interview
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3.5">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, tags (e.g. Graph, Hash Table, Sliding Window)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Categories</option>
            <option value="DSA">DSA / Algorithms</option>
            <option value="SystemDesign">System Design</option>
            <option value="BugFix">Practical Bug Fixing</option>
            <option value="Refactoring">Refactoring</option>
          </select>
        </div>
      </div>

      {/* Problem Grid */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-300 text-base">
            <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span>Loading coding challenges...</span>
          </div>
        </div>
      ) : filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((problem) => {
            const diff = getDifficultyColor(problem.difficulty);
            return (
              <Card
                key={problem.id}
                className="border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between p-2 shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${diff.bg} ${diff.text} ${diff.border}`}>
                      {problem.difficulty}
                    </span>
                    <Badge variant="indigo" className="text-xs px-2.5 py-0.5 font-semibold">{problem.category}</Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-white line-clamp-1">{problem.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {problem.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {problem.tags?.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags?.length > 3 && (
                      <span className="text-xs text-slate-400 font-medium self-center">
                        +{problem.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-400 font-mono font-medium">
                      {problem.testCasesCount} Test Cases
                    </span>

                    <Link href={`/interview/setup?problemId=${problem.id}`}>
                      <Button variant="primary" size="sm" className="gap-2 text-xs sm:text-sm font-bold px-3.5 py-1.5 shadow-indigo-600/25">
                        <Play className="h-3.5 w-3.5 fill-white" /> Practice Problem
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center border border-dashed border-slate-800 rounded-3xl p-10 space-y-3">
          <BookOpen className="h-12 w-12 text-slate-600 mb-1" />
          <p className="text-base font-bold text-white">No matching coding problems found.</p>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Try adjusting your search filters or generate an AI-customized session.
          </p>
          <Link href="/interview/setup" className="pt-2">
            <Button variant="primary" size="sm" className="text-sm font-bold px-5 py-2.5">
              Generate Custom AI Interview
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
