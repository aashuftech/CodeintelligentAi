import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode2, Scale, AlertTriangle, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - CodeIntelligent AI",
  description: "Terms and conditions governing the use of CodeIntelligent AI interview platform, Monaco IDE, and code sandboxes.",
};

export default function TermsOfServicePage() {
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
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
            <p className="text-sm sm:text-base text-slate-300">
              Please read these terms carefully before utilizing our AI interview platform and execution environment.
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
              <CheckCircle2 className="h-5 w-5 text-indigo-400" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              By accessing or creating an account on CodeIntelligent AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our services immediately.
            </p>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <FileCode2 className="h-5 w-5 text-emerald-400" />
              2. Code Ownership & Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Your Submissions:</strong> You retain full ownership, copyright, and intellectual property rights to any original code solutions, algorithms, and answers you draft during interview sessions.
            </p>
            <p>
              <strong className="text-white">Platform Property:</strong> The platform design, problem prompts, test suites, evaluation algorithms, and UI assets are the exclusive intellectual property of CodeIntelligent AI.
            </p>
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              3. Prohibited Conduct & Sandbox Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>Attempting container escapes, privilege escalation, or executing malicious binaries in our runner sandbox.</li>
              <li>Launching denial-of-service (DoS) attacks, socket floods, or cryptomining scripts.</li>
              <li>Automated scraping or bulk exfiltration of problem bank questions and test cases.</li>
              <li>Reverse engineering or tampering with the AI rubric evaluation engine.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              4. Disclaimer of Warranty & Hiring Guarantees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              CodeIntelligent AI provides an educational simulation and practice platform. While our evaluations and scorecards use rigorous engineering rubrics, performance on this platform does not constitute a formal guarantee of employment or hiring outcomes at third-party companies.
            </p>
            <p>
              The platform is provided on an "as is" and "as available" basis without warranties of any kind.
            </p>
          </CardContent>
        </Card>

        {/* Section 5 */}
        <Card className="border-slate-800 bg-slate-900/60 p-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
              <Scale className="h-5 w-5 text-purple-400" />
              5. Modifications & Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 leading-relaxed">
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the platform following any modifications constitutes your acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
