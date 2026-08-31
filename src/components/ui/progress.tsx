import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "indigo" | "emerald" | "amber" | "rose";
}

export function ProgressBar({ value, max = 100, className, color = "indigo" }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const colors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-800", className)}>
      <div
        className={cn("h-full transition-all duration-500 rounded-full", colors[color])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
