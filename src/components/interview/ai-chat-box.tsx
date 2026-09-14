"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
} from "lucide-react";

export interface ChatMessage {
  role: "interviewer" | "candidate" | "system";
  content: string;
  timestamp: string | Date;
  type?: "speech" | "hint" | "proactive_question" | "code_review" | "clarification";
}

interface AIChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: "speech" | "hint" | "clarification") => Promise<void>;
  isLoading?: boolean;
  onRequestHint: () => void;
}

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  onRequestHint,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Optional Text-To-Speech for AI Interviewer speech
  const speakMessage = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Optional Web Speech API for voice input
  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput("");
    await onSendMessage(messageText, "speech");
  };

  return (
    <div className="flex h-full flex-col bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-500/20">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Technical Interviewer
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">Principal Engineer Evaluator</p>
          </div>
        </div>

        {/* Action icons: TTS Toggle & Voice Input indicator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`rounded-xl p-2 text-xs transition-colors ${
              speechEnabled
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
            title={speechEnabled ? "Voice Output Enabled" : "Enable Voice Output (TTS)"}
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRequestHint}
            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-xs py-1.5 px-3 h-auto gap-1.5 font-bold"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Hint</span>
          </Button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5 text-sm">
        {messages.map((msg, idx) => {
          const isInterviewer = msg.role === "interviewer";
          const isHint = msg.type === "hint";

          return (
            <div
              key={idx}
              className={`flex gap-3 ${isInterviewer ? "items-start" : "items-start flex-row-reverse"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${
                  isInterviewer
                    ? isHint
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                {isInterviewer ? isHint ? <Lightbulb className="h-4 w-4" /> : <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-md ${
                  isInterviewer
                    ? isHint
                      ? "bg-amber-950/40 text-amber-100 border border-amber-500/20"
                      : "bg-slate-900 border border-slate-800 text-slate-200"
                    : "bg-indigo-600 text-white shadow-indigo-600/10"
                }`}
              >
                <div className="whitespace-pre-wrap text-xs sm:text-sm">{msg.content}</div>
                <div
                  className={`mt-1.5 text-[10px] font-mono ${
                    isInterviewer ? "text-slate-500" : "text-indigo-200/80"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-1 font-medium text-slate-400">Interviewer is analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <form onSubmit={handleSend} className="border-t border-slate-800/80 bg-slate-900/60 p-3.5">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleListening}
            className={`rounded-xl p-2.5 transition-all ${
              isListening
                ? "bg-rose-600 text-white animate-pulse"
                : "border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak to AI interviewer"}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening to your voice..." : "Explain your thought process, ask clarifying questions..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />

          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="rounded-xl px-4 py-2.5 shadow-indigo-600/30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
