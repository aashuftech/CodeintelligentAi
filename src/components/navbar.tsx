"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Code2,
  Terminal,
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "admin";
  targetRole?: string;
  averageScore?: number;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    setMobileNavOpen(false);
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setMobileNavOpen(false);
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  // Hide standard navbar on full-screen active interview IDE session
  if (pathname?.startsWith("/interview/") && !pathname?.includes("/setup") && !pathname?.includes("/report")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
              CodeIntelligent <span className="text-indigo-400">AI</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Live AI Interviewer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {user && (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                Dashboard
              </Link>
              <Link
                href="/interview/setup"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  pathname.startsWith("/interview/setup")
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Code2 className="h-4 w-4 text-emerald-400" />
                Start Interview
              </Link>
            </>
          )}

          <Link
            href="/problems"
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
              pathname.startsWith("/problems")
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BookOpen className="h-4 w-4 text-blue-400" />
            Problem Bank
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Controls: User Menu & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-800" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 sm:pr-3.5 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 font-bold text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">{user.name}</span>
                  <span className="text-xs text-slate-400 capitalize font-medium">{user.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block ml-1" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900 p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-800 mb-1.5">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-300 truncate mt-0.5">{user.email}</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <Badge variant="indigo" className="text-xs">{user.targetRole || "Candidate"}</Badge>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {user.averageScore ? `${user.averageScore}/100` : "No score"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-400" /> Dashboard
                  </Link>

                  <Link
                    href="/interview/setup"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    <Code2 className="h-4 w-4 text-emerald-400" /> Start Practice Interview
                  </Link>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-rose-400 hover:bg-rose-500/15 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm font-semibold px-3 py-1.5">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="text-sm font-bold px-4 py-2 shadow-indigo-600/30">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-slate-200" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          {user && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-2xl p-3.5 text-sm font-semibold transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-200 hover:bg-slate-900"
                }`}
              >
                <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/interview/setup"
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-2xl p-3.5 text-sm font-semibold transition-colors ${
                  pathname.startsWith("/interview/setup")
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Code2 className="h-5 w-5 text-emerald-400" />
                <span>Start Practice Interview</span>
              </Link>
            </>
          )}

          <Link
            href="/problems"
            onClick={() => setMobileNavOpen(false)}
            className={`flex items-center gap-3 rounded-2xl p-3.5 text-sm font-semibold transition-colors ${
              pathname.startsWith("/problems")
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-200 hover:bg-slate-900"
            }`}
          >
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span>Problem Bank</span>
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 rounded-2xl p-3.5 text-sm font-semibold transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-200 hover:bg-slate-900"
              }`}
            >
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <span>Admin Portal</span>
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-sm font-bold text-rose-400 hover:bg-rose-500/15 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
