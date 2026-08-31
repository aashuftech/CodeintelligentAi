"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on full-screen active interview IDE session
  if (pathname?.startsWith("/interview/") && !pathname?.includes("/setup") && !pathname?.includes("/report")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-6 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <span className="text-base font-mono font-bold text-indigo-400">&gt;_</span>
          <span className="font-bold text-white text-sm">
            CodeIntelligent <span className="text-indigo-400">AI</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">AI Coding Interview Platform</span>
        </div>

        {/* Right Side: Links & Copyright */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-slate-400">
          <Link href="/privacy" className="hover:text-slate-200 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-200 transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span>© 2026 CodeIntelligent AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
