"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { getDifficultyColor, formatDuration, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Code2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  Lock,
  Sparkles,
} from "lucide-react";

export default function AdminPortalPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // New problem form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [category, setCategory] = useState<"DSA" | "SystemDesign" | "BugFix" | "Refactoring">("DSA");
  const [tags, setTags] = useState("Algorithms, Data Structures");
  const [testCasesInput, setTestCasesInput] = useState(`[
  { "input": "[2, 7, 11, 15], 9", "expectedOutput": "[0, 1]", "isHidden": false, "explanation": "2 + 7 = 9" },
  { "input": "[3, 2, 4], 6", "expectedOutput": "[1, 2]", "isHidden": false, "explanation": "2 + 4 = 6" },
  { "input": "[3, 3], 6", "expectedOutput": "[0, 1]", "isHidden": true, "explanation": "Hidden test case" }
]`);
  const [starterPy, setStarterPy] = useState("def solution(input):\n    # Write your solution here\n    pass");
  const [starterJs, setStarterJs] = useState("function solution(input) {\n  // Write your solution here\n}");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setIsAuthLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        if (data.user?.role === "admin") {
          fetchProblems();
        }
      }
    } catch (e) {
      console.error("Auth check failed:", e);
    } finally {
      setIsAuthLoading(false);
      setIsLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const res = await fetch("/api/problems");
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

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setDifficulty("medium");
    setCategory("DSA");
    setTags("Algorithms, Data Structures");
    setTestCasesInput(`[
  { "input": "[2, 7, 11, 15], 9", "expectedOutput": "[0, 1]", "isHidden": false, "explanation": "2 + 7 = 9" },
  { "input": "[3, 2, 4], 6", "expectedOutput": "[1, 2]", "isHidden": false, "explanation": "2 + 4 = 6" },
  { "input": "[3, 3], 6", "expectedOutput": "[0, 1]", "isHidden": true, "explanation": "Hidden test case" }
]`);
    setModalError("");
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError("");

    try {
      let parsedTestCases = [];
      try {
        parsedTestCases = JSON.parse(testCasesInput);
        if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
          throw new Error("Test cases must be a non-empty array of objects.");
        }
      } catch (err: any) {
        throw new Error(err.message || "Invalid JSON syntax in Test Cases input.");
      }

      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: generatedSlug,
          description: description.trim(),
          difficulty,
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          starterCode: {
            python: starterPy,
            javascript: starterJs,
            typescript: starterJs,
            java: "public class Solution {\n    public static Object solve(Object input) {\n        return null;\n    }\n}",
            cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}",
            go: "package main\n\nfunc solution() {}\n",
          },
          testCases: parsedTestCases,
          hints: ["Decompose the problem step by step.", "Consider time and space complexity trade-offs."],
          timeLimitMs: 5000,
          memoryLimitMb: 128,
        }),
      });

      const d = await res.json();
      if (!res.ok) {
        throw new Error(d.error || "Failed to create problem");
      }

      setIsCreateModalOpen(false);
      resetForm();
      setActionMessage("Problem created successfully!");
      setTimeout(() => setActionMessage(""), 4000);
      fetchProblems();
    } catch (err: any) {
      setModalError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProblem = async (id: string, problemTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${problemTitle}"?`)) return;

    try {
      const res = await fetch(`/api/problems/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete problem");
        return;
      }

      setProblems((prev) => prev.filter((p) => p.id !== id));
      setActionMessage(`"${problemTitle}" deleted successfully!`);
      setTimeout(() => setActionMessage(""), 4000);
    } catch (e: any) {
      alert("Delete failed: " + (e.message || "Server error"));
    }
  };

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm">
          <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Verifying administrator permissions...</span>
        </div>
      </div>
    );
  }

  // Access Denied if not logged in or role is not admin
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex min-h-[75vh] items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-lg border-slate-800/80 bg-slate-900/90 shadow-2xl p-5 sm:p-6 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Admin Authorization Required
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              This portal is restricted to platform administrators. Your current account (
              <span className="font-semibold text-white">{currentUser?.email || "Guest"}</span>) does not have admin privileges.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left text-xs text-slate-300 space-y-2">
            <p className="font-bold text-white flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-indigo-400" />
              How to configure Admin access:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
              <li>
                Add your email to <strong className="font-mono text-indigo-300">ADMIN_EMAILS</strong> in <code className="text-slate-200">.env.local</code>.
              </li>
              <li>
                Or update your user document with <code className="font-mono text-emerald-300">role: "admin"</code> in MongoDB.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full text-xs sm:text-sm font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20">
                Switch Account
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full text-xs sm:text-sm font-semibold px-4 py-2 border-slate-800 bg-slate-900/50">
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 border-b border-slate-800/80 pb-6 sm:pb-7">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <ShieldCheck className="h-7 w-7 text-indigo-400" />
              Admin Portal
            </h1>
            <Badge variant="indigo" className="text-xs px-2.5 py-0.5 font-semibold">Administrator</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Manage the problem bank, configure test suites, and monitor candidate evaluations.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          className="w-full sm:w-auto gap-2 text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/25"
        >
          <Plus className="h-4 w-4" /> Create Coding Challenge
        </Button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs sm:text-sm font-semibold text-emerald-300 flex items-center gap-2.5 animate-in fade-in duration-200 shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Challenges */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Challenges</span>
              <div className="text-2.5xl sm:text-3.5xl font-black text-white font-mono">{problems.length}</div>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>

        {/* Active System Health */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active System Health
              </span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  Sandboxes Operational
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
              <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>

        {/* AI Engine */}
        <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-lg">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Engine</span>
              <div className="text-sm sm:text-base font-bold text-indigo-400 mt-1">Gemini 3.7 Flash</div>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Bank Table */}
      <Card className="border-slate-800/80 bg-slate-900/60 p-2 shadow-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-white">
            <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            Problem Bank Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-400">Loading problem bank...</div>
          ) : problems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400">
                    <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Title</th>
                    <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Difficulty</th>
                    <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Category</th>
                    <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Test Cases</th>
                    <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Created</th>
                    <th className="pb-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {problems.map((p) => {
                    const diff = getDifficultyColor(p.difficulty);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 font-bold text-white text-xs sm:text-sm">{p.title}</td>
                        <td className="py-3.5">
                          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${diff.bg} ${diff.text} ${diff.border}`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-300 font-medium text-xs">{p.category}</td>
                        <td className="py-3.5 text-slate-400 font-mono text-xs">{p.testCasesCount} Cases</td>
                        <td className="py-3.5 text-slate-400 text-xs">{formatDate(p.createdAt)}</td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteProblem(p.id, p.title)}
                            className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Problem"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-xs sm:text-sm text-slate-400">
              No problems found in bank. Click "Create Coding Challenge" above.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Problem Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Coding Challenge"
        description="Add a new challenge with starter code and test harness cases."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProblem} className="space-y-4 text-xs sm:text-sm">
          {modalError && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-200 text-xs">Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Invert Binary Tree"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-200 text-xs">Slug (optional)</label>
              <input
                type="text"
                placeholder="invert-binary-tree"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-200 text-xs">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs sm:text-sm text-white font-medium cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-200 text-xs">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs sm:text-sm text-white font-medium cursor-pointer"
              >
                <option value="DSA">DSA / Algorithms</option>
                <option value="SystemDesign">System Design</option>
                <option value="BugFix">Practical Bug Fixing</option>
                <option value="Refactoring">Refactoring</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-200 text-xs">Problem Description (Markdown)</label>
            <textarea
              rows={4}
              required
              placeholder="Describe problem statement, input formats, examples & constraints..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-200 text-xs">Test Cases (JSON array)</label>
            <textarea
              rows={3}
              required
              value={testCasesInput}
              onChange={(e) => setTestCasesInput(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-xs sm:text-sm font-semibold px-4 py-2 border-slate-800 bg-slate-900/50"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              className="text-xs sm:text-sm font-bold px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Save Problem
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
