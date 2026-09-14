import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Eye, Server, Cpu, FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - CodeIntelligent AI",
  description: "Learn how CodeIntelligent AI protects candidate data, code submissions, audio transcripts, and AI evaluations.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <span className="text-xs font-mono text-slate-400">Effective Date: January 1, 2026</span>
      </div>

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
            <p className="text-sm sm:text-base text-slate-300">
              How CodeIntelligent AI collects, encrypts, and handles your interview data.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <Eye className="h-5 w-5 text-indigo-400" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              When you use CodeIntelligent AI to practice coding interviews, we collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>
                <strong className="text-white">Account Information:</strong> Name, email address, password hash (salted using bcrypt), target role, and seniority level.
              </li>
              <li>
                <strong className="text-white">Code Submissions:</strong> Source code written in our Monaco IDE across Python, JavaScript, TypeScript, Java, C++, and Go.
              </li>
              <li>
                <strong className="text-white">Interview Transcripts & Voice Audio:</strong> Text messages, conversation turns with the AI Interviewer, and optional speech recognition streams.
              </li>
              <li>
                <strong className="text-white">Execution Metrics:</strong> Runtime latency, peak memory usage, test case pass/fail outcomes, and Big-O detected complexities.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <Cpu className="h-5 w-5 text-emerald-400" />
              2. How We Use Your Information & AI Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              Your interview submissions are processed solely for the purpose of simulating authentic technical assessments:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>
                <strong className="text-white">Multi-Dimensional Evaluation:</strong> Generating 6-rubric competency scores (Correctness, Code Quality, Big-O, Edge Cases, Problem Solving, Communication).
              </li>
              <li>
                <strong className="text-white">Personalized Study Roadmap:</strong> Recommending algorithmic topics tailored to your weaknesses.
              </li>
              <li>
                <strong className="text-white">No Model Training on Private Candidate Code:</strong> Your proprietary interview code is never used to train public machine learning foundation models without explicit opt-in consent.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <Server className="h-5 w-5 text-amber-400" />
              3. Sandboxed Execution & Security Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              Code execution is conducted within ephemeral, non-privileged Docker/gVisor sandboxes with strict CPU and memory resource quotas (5-second execution timeout, 128MB RAM).
            </p>
            <p>
              All data in transit is encrypted using TLS 1.3, and sessions are secured with signed HTTP-only JWT authentication tokens.
            </p>
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <Lock className="h-5 w-5 text-indigo-400" />
              4. Data Retention & Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              You maintain complete ownership of your interview history. You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>Access and export your interview evaluation reports and code transcripts at any time.</li>
              <li>Request complete deletion of your user account, interview sessions, and scorecard data.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <FileText className="h-5 w-5 text-cyan-400" />
              5. Contact & Data Protection Officer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 leading-relaxed">
            <p>
              If you have any questions or privacy inquiries regarding our AI interview evaluations, please reach out to our security team at{" "}
              <span className="font-mono text-indigo-400 font-bold">privacy@codeintelligent.ai</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
