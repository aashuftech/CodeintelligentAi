"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ProgressBar } from "../ui/progress";
import { TrendingUp, Award, Zap, Code, ShieldCheck, MessageSquare } from "lucide-react";

interface SkillItem {
  name: string;
  category: string;
  score: number;
  assessedCount: number;
}

interface ScoreHistoryItem {
  index: number;
  date: string;
  score: number;
  difficulty: string;
}

interface ScoreChartProps {
  skills: SkillItem[];
  scoreHistory: ScoreHistoryItem[];
  averageScore: number;
}

export function ScoreAnalyticsPanel({ skills, scoreHistory, averageScore }: ScoreChartProps) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "DSA":
        return <Zap className="h-4 w-4 text-amber-400" />;
      case "SystemDesign":
        return <Award className="h-4 w-4 text-indigo-400" />;
      case "CodeQuality":
        return <Code className="h-4 w-4 text-emerald-400" />;
      case "ProblemSolving":
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case "Communication":
        return <MessageSquare className="h-4 w-4 text-purple-400" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-slate-400" />;
    }
  };

  const hasEvaluations = skills && skills.some((s) => s.score > 0 || (s.assessedCount && s.assessedCount > 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skill Matrix */}
      <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <Zap className="h-5 w-5 text-indigo-400" />
              Skill Proficiency Matrix
            </CardTitle>
            <span className="text-xs sm:text-sm text-slate-400 font-semibold">5 Core Competencies</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {hasEvaluations ? (
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2.5 font-semibold text-slate-200">
                      {getCategoryIcon(skill.category)}
                      {skill.name}
                    </span>
                    <span className="font-bold text-white font-mono text-sm">{skill.score}/100</span>
                  </div>
                  <ProgressBar
                    value={skill.score}
                    color={skill.score >= 80 ? "emerald" : skill.score >= 60 ? "indigo" : "amber"}
                    className="h-2.5"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2 text-center">
              <Zap className="h-8 w-8 text-slate-600 mb-1 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">No interview evaluations yet</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Complete your first live AI interview session to assess and generate your 5-dimensional skill breakdown.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Score Progression Trend */}
      <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Performance Progression
            </CardTitle>
            <span className="text-sm font-bold text-emerald-400 font-mono">Avg: {averageScore}/100</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {scoreHistory && scoreHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-3 h-48 pt-6 px-3 border-b border-slate-800">
                {scoreHistory.map((item, idx) => {
                  const heightPercent = Math.max(20, item.score);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-xs font-mono font-bold text-indigo-400 group-hover:scale-110 transition-transform">
                        {item.score}
                      </span>
                      <div
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 group-hover:brightness-125 transition-all shadow-md"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-semibold px-2">
                <span>Session #1</span>
                <span>Latest Session (#{scoreHistory.length})</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2 text-center">
              <TrendingUp className="h-8 w-8 text-slate-600 mb-1 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">No score history yet</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Complete your first interview to track your score progression over time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
