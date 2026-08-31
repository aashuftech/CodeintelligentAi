"use client";

import React, { useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Play, Send, RefreshCw, Settings2, Code, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

interface MonacoEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export function MonacoCodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
}: MonacoEditorProps) {
  const [fontSize, setFontSize] = useState<number>(14);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");

  const languages = [
    { id: "python", label: "Python 3" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
    { id: "java", label: "Java 17" },
    { id: "cpp", label: "C++ 20" },
    { id: "go", label: "Go 1.22" },
  ];

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "python":
        return "python";
      case "javascript":
        return "javascript";
      case "typescript":
        return "typescript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      case "go":
        return "go";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/90 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size controls */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <span className="text-[11px] text-slate-400">Size:</span>
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 hover:text-white"
            >
              -
            </button>
            <span className="text-xs text-slate-300 font-mono">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(22, fontSize + 1))}
              className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 hover:text-white"
            >
              +
            </button>
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setEditorTheme(editorTheme === "vs-dark" ? "light" : "vs-dark")}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Toggle Editor Theme"
          >
            {editorTheme === "vs-dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Action Buttons: Reset, Run, Submit */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            title="Reset to Starter Code"
            className="text-slate-400 hover:text-slate-200 px-2 sm:px-3 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onRun}
            isLoading={isRunning}
            title="Run Code against Sample Cases (Ctrl+Enter)"
            className="text-xs px-2.5 sm:px-3.5"
          >
            <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 fill-emerald-400/30" />
            <span>Run</span>
            <span className="hidden sm:inline">Code</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            title="Submit Final Code for Evaluation"
            className="text-xs px-2.5 sm:px-3.5 shadow-indigo-600/25"
          >
            <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Submit</span>
            <span className="hidden sm:inline">Solution</span>
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          theme={editorTheme}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            renderLineHighlight: "all",
            padding: { top: 10, bottom: 10 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-slate-950 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                Loading Monaco IDE...
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
