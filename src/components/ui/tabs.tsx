import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode; badge?: string | number }>;
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center space-x-1 border-b border-slate-800 bg-slate-900/50 p-1.5 rounded-xl", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all",
              isActive
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                  isActive ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { Modal } from "./modal";
export { ProgressBar } from "./progress";
