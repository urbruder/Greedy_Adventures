"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Compass,
} from "lucide-react";
import { ModeBadge } from "./ModeBadge";
import { SourceChip } from "./SourceChip";
import { PdfCard } from "./PdfCard";
import { VideoCard } from "./VideoCard";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorBanner } from "./ErrorBanner";
import { SuggestionChips } from "./SuggestionChips";
import { NotAvailableMessage } from "./NotAvailableMessage";
import { Media } from "@/lib/media/types";
import { SourceReference } from "@/lib/chat/types";

export interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceReference[];
  media?: {
    pdf: Media | null;
    video: Media | null;
  };
  isError?: boolean;
}

interface ChatPanelProps {
  initialOpen?: boolean;
  onClose?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch initial mode from server
  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data) => {
        if (data.currentMode) setMode(data.currentMode);
      })
      .catch(() => {});
  }, []);

  // Keyboard navigation: Escape key closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap / focus management when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setError(null);
    setInput("");

    const userMessage: UiMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const payload = {
        messages: nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get an answer.");
      }

      if (data.mode) {
        setMode(data.mode);
      }

      const assistantMsg: UiMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: data.text,
        sources: data.sources || [],
        media: data.media || { pdf: null, video: null },
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      handleSend(lastUser.content);
    }
  };

  return (
    <>
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 bg-deep-navy text-pure-white rounded-full shadow-modal hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-sky-blue/30 group focus:outline-none focus:ring-4 focus:ring-sky-blue/30"
          aria-label="Open Sea View Skydiving Assistant"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-sky-blue flex items-center justify-center text-pure-white shadow-sm">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-deep-navy" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-none text-pure-white group-hover:text-sky-blue transition-colors">
              Sea View Assistant
            </span>
            <span className="text-[11px] text-tertiary-fixed/80 leading-tight mt-1">
              Ask about packages & media
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-sunrise-orange ml-1" />
        </button>
      )}

      {/* Chat Sheet / Floating Panel */}
      {isOpen && (
        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Sea View Skydiving Chatbot Assistant"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-pure-white overflow-hidden shadow-modal border border-stroke-soft
            /* Mobile: full-screen sheet */
            inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:rounded-3xl
            ${
              isMinimized
                ? "sm:h-[64px] h-[64px]"
                : "sm:h-[640px] sm:max-h-[calc(100vh-4rem)] h-full"
            }
          `}
        >
          {/* Header */}
          <header className="px-5 py-3.5 bg-deep-navy text-pure-white flex items-center justify-between shrink-0 shadow-sm relative">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Greedy Adventures Logo"
                  className="h-8 w-auto bg-white/95 px-2 py-1 rounded-lg object-contain shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-deep-navy" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm text-pure-white truncate">
                    Sea View Assistant
                  </h2>
                  <ModeBadge mode={mode} compact />
                </div>
                <span className="text-[11px] text-tertiary-fixed/80 leading-tight mt-0.5 truncate">
                  Pattaya Dropzone Ground Truth
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 text-pure-white/80">
              <button
                type="button"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-pure-white hover:bg-pure-white/10 transition-colors focus:outline-none"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                aria-label="Close assistant panel"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-pure-white hover:bg-pure-white/10 transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mode description ribbon */}
          {!isMinimized && (
            <div className="px-4 py-1.5 bg-surface-container-low border-b border-stroke-soft flex items-center justify-between text-[11px] text-tertiary">
              <span className="truncate">
                {mode === "demo"
                  ? "Demo mode: no AI key. Answers assembled from website sources."
                  : "Live AI mode: Powered by model provider."}
              </span>
              <a
                href="/knowledge"
                className="text-sky-blue hover:underline font-semibold shrink-0 ml-2"
              >
                View Sources
              </a>
            </div>
          )}

          {/* Body: Message thread */}
          {!isMinimized && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-canvas-off-white text-on-surface">
              {/* Welcoming state */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-surface-container-lowest border border-stroke-soft shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-deep-navy font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-sunrise-orange" />
                      <span>Welcome to Sea View Skydiving!</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      I can answer questions about our Thailand tandem packages (ECO,
                      DELUXE, VIP), pricing, inclusions, and share our official brochure or
                      jump video.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider block px-1">
                      Suggested questions:
                    </span>
                    <SuggestionChips
                      onSelect={(suggestion) => handleSend(suggestion)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Message list */}
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] px-4 py-3 bg-deep-navy text-pure-white rounded-2xl rounded-br-sm shadow-sm">
                        <p className="text-xs leading-relaxed text-pure-white">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-sky-blue/20 text-sky-blue flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[11px] font-bold">SV</span>
                      </div>
                      <div className="max-w-[88%] space-y-2.5 w-full">
                        {/* Text bubble */}
                        {msg.content && (
                          <div className="px-4 py-3 bg-surface-container-low text-deep-navy rounded-2xl rounded-tl-sm shadow-sm border border-stroke-soft prose-xs">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        )}

                        {/* PDF Card */}
                        {msg.media?.pdf && (
                          <PdfCard
                            title={msg.media.pdf.title}
                            url={msg.media.pdf.url}
                            isDemo={msg.media.pdf.isDemo}
                          />
                        )}

                        {/* Video Card */}
                        {msg.media?.video && (
                          <VideoCard
                            title={msg.media.video.title}
                            url={msg.media.video.url}
                            sourceUrl={msg.media.video.sourceUrl}
                            isDemo={msg.media.video.isDemo}
                          />
                        )}

                        {/* Source Chips Row */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">
                              Sources:
                            </span>
                            {msg.sources.map((src) => (
                              <SourceChip
                                key={src.url}
                                title={src.title}
                                url={src.url}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}

              {/* Error banner */}
              {error && (
                <ErrorBanner
                  message={error}
                  onRetry={handleRetry}
                  canFallbackToDemo={mode === "live"}
                  onFallbackToDemo={() => {
                    setMode("demo");
                    handleRetry();
                  }}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Footer Composer */}
          {!isMinimized && (
            <footer className="p-3 bg-pure-white shrink-0 border-t border-stroke-soft space-y-2">
              {messages.length > 0 && (
                <SuggestionChips
                  onSelect={(suggestion) => handleSend(suggestion)}
                  disabled={isLoading}
                />
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about packages, video, brochure..."
                  aria-label="Type your message"
                  className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-full text-xs text-deep-navy placeholder:text-outline border border-stroke-soft focus:outline-none focus:ring-2 focus:ring-sky-blue focus:bg-pure-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-full bg-sunrise-orange hover:brightness-105 active:scale-95 text-pure-white flex items-center justify-center shrink-0 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </footer>
          )}
        </aside>
      )}
    </>
  );
};

