import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getDifficultyColor(difficulty: string): { bg: string; text: string; border: string } {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" };
    case "medium":
      return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
    case "hard":
      return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" };
    default:
      return { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" };
  }
}
