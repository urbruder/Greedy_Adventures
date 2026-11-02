"use client";

import React, { useState } from "react";
import { Play, Sparkles, CheckCircle2, FileText, Video, AlertCircle } from "lucide-react";
import { ModeBadge } from "@/components/chat/ModeBadge";
import { Chunk } from "@/lib/knowledge/types";
import { Media } from "@/lib/media/types";

interface TestResponse {
  mode: "demo" | "live";
  chunks: Chunk[];
  mediaSelected: {
    pdf: Media | null;
    video: Media | null;
    requestedTypes: string[];
    unavailabilityNotices: string[];
  };
  answerPreview: string;
  bestScore: number;
  hasRelevantChunks: boolean;
}

export const TestPanel: React.FC = () => {
  const [question, setQuestion] = useState(
    "What is included in the package?"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async (testQuery?: string) => {
    const q = (testQuery || question).trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/knowledge/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to test retrieval");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Test execution failed");
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What is included in the package?",
    "Can you send me a brochure?",
    "Can I see a video of the experience?",
    "Send me the brochure and a video.",
    "Price of VIP",
    "How much is the jump in Mount Abu?",
    "What's the capital of France?",
    "How long is the freefall?",
  ];

  return (
    <div className="bg-pure-white rounded-3xl shadow-card border border-stroke-soft overflow-hidden sticky top-24">
      {/* Sky Blue top accent bar */}
      <div className="h-1.5 w-full bg-sky-blue" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-blue" />
              <h2 className="text-lg font-bold text-deep-navy">
                Test Assistant Retrieval
              </h2>
            </div>
            <p className="text-xs text-tertiary mt-1">
              Runs the real pipeline used by /api/chat. Verifies source chunking and deterministic media selection.
            </p>
          </div>
          {result && <ModeBadge mode={result.mode} compact />}
        </div>

        {/* Query Input */}
        <div className="space-y-3">
          <label
            htmlFor="test-question-input"
            className="text-xs font-bold text-deep-navy block uppercase tracking-wider"
          >
            Evaluation Question
          </label>
          <div className="relative">
            <input
              id="test-question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type any question (e.g. package price, brochure, video)..."
              className="w-full px-4 py-3 bg-surface-container-low rounded-2xl text-xs font-semibold text-deep-navy border border-stroke-soft focus:outline-none focus:ring-2 focus:ring-sky-blue focus:bg-pure-white"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-tertiary uppercase">
              Quick test:
            </span>
            {sampleQuestions.slice(0, 4).map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => {
                  setQuestion(sq);
                  runTest(sq);
                }}
                className="px-2.5 py-1 rounded-full bg-surface-container text-[11px] font-medium text-deep-navy hover:bg-surface-container-high transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={loading || !question.trim()}
            onClick={() => runTest()}
            className="w-full py-3 px-6 rounded-full bg-sunrise-orange hover:brightness-105 active:scale-98 text-pure-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{loading ? "Running Retrieval Pipeline..." : "Run Test Pipeline"}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-900 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-5 pt-4 border-t border-stroke-soft animate-fadeIn">
            {/* Telemetry pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs border border-stroke-soft">
              <span className="font-semibold text-deep-navy flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    result.hasRelevantChunks ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                Best Score: {result.bestScore}
              </span>
              <span className="text-tertiary">
                {result.hasRelevantChunks ? "Relevant chunks found" : "Below threshold"}
              </span>
            </div>

            {/* Result Block A: Source Chunks Passed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-deep-navy">
                  Result Block a) Source text passed to model
                </span>
                <span className="text-[11px] font-bold text-sky-blue">
                  {result.chunks.length} chunks
                </span>
              </div>

              {result.chunks.length === 0 ? (
                <div className="p-3 rounded-xl bg-surface-container text-xs text-tertiary">
                  No chunks passed (query score below threshold).
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {result.chunks.map((chunk, idx) => (
                    <div
                      key={chunk.id || idx}
                      className="p-3 rounded-xl bg-surface-container-low border border-stroke-soft space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-deep-navy truncate max-w-[200px]">
                          {chunk.title}
                        </span>
                        {chunk.score && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            Score: {chunk.score}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-tertiary font-mono truncate block">
                        {chunk.url}
                      </span>
                      <p className="text-xs font-mono text-on-surface-variant line-clamp-3 bg-surface-container p-2 rounded-lg">
                        {chunk.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Result Block B: Media Selected */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-deep-navy block">
                Result Block b) Media selected by deterministic selector
              </span>

              <div className="space-y-1.5">
                {result.mediaSelected.pdf ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-stroke-soft text-xs text-deep-navy">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="font-semibold">{result.mediaSelected.pdf.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      PDF Attached
                    </span>
                  </div>
                ) : null}

                {result.mediaSelected.video ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-stroke-soft text-xs text-deep-navy">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-sky-blue" />
                      <span className="font-semibold">{result.mediaSelected.video.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-sky-blue bg-sky-blue/10 px-2 py-0.5 rounded-full">
                      Video Attached
                    </span>
                  </div>
                ) : null}

                {!result.mediaSelected.pdf && !result.mediaSelected.video && (
                  <div className="p-2.5 rounded-xl bg-surface-container text-xs text-tertiary">
                    None (No media keywords detected)
                  </div>
                )}
              </div>
            </div>

            {/* Result Block C: Answer Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-deep-navy">
                  Result Block c) Assistant Answer Preview
                </span>
                <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Grounded Answer</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-stroke-soft text-xs text-deep-navy leading-relaxed whitespace-pre-line">
                {result.answerPreview}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

