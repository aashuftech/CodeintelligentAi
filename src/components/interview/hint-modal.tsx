"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Lightbulb, Sparkles, HelpCircle } from "lucide-react";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestHint: (level: number) => Promise<void>;
  isLoading?: boolean;
}

export function HintModal({
  isOpen,
  onClose,
  onRequestHint,
  isLoading = false,
}: HintModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const levels = [
    {
      level: 1,
      title: "Level 1: Conceptual Nudge",
      description: "A gentle direction on general data structure choice or pattern without revealing the algorithm.",
    },
    {
      level: 2,
      title: "Level 2: Algorithmic Approach",
      description: "Guidance on loop invariants, pointers, recursion state, or dynamic programming transitions.",
    },
    {
      level: 3,
      title: "Level 3: Edge Case / Invariant Pointer",
      description: "A concrete pointer for tricky bounds, base cases, and data structure lookups.",
    },
  ];

  const handleSubmit = async () => {
    await onRequestHint(selectedLevel);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Progressive Hint"
      description="Select how much assistance you need. Asking for conceptual hints won't heavily penalize your score."
    >
      <div className="space-y-3.5 my-4">
        {levels.map((item) => (
          <div
            key={item.level}
            onClick={() => setSelectedLevel(item.level)}
            className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all ${
              selectedLevel === item.level
                ? "border-indigo-500 bg-indigo-500/15 text-white ring-2 ring-indigo-500/50 shadow-md"
                : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                selectedLevel === item.level ? "bg-indigo-600 text-white shadow-md" : "bg-slate-800 text-slate-400"
              }`}
            >
              {item.level}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading} className="font-bold px-4 gap-2">
          <Sparkles className="h-4 w-4" />
          Request Level {selectedLevel} Hint
        </Button>
      </div>
    </Modal>
  );
}
