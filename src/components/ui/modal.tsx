import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, description, children, maxWidth = "md" }: ModalProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={cn(
          "relative w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200",
          widthClasses[maxWidth]
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {description && <p className="text-sm text-slate-300 leading-relaxed font-normal">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
