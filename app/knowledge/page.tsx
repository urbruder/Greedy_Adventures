import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Database, ShieldCheck, CheckCircle2 } from "lucide-react";
import { loadSources } from "@/lib/knowledge/loadSources";
import { getMediaRegistry } from "@/lib/media/registry";
import { getCurrentEngineMode } from "@/lib/chat/getEngine";
import { ModeBadge } from "@/components/chat/ModeBadge";
import { SourcesList } from "@/components/knowledge/SourcesList";
import { MediaList } from "@/components/knowledge/MediaList";
import { TestPanel } from "@/components/knowledge/TestPanel";

export const metadata = {
  title: "Chatbot Knowledge View — Sea View Skydiving",
  description:
    "Read-only knowledge inspection view showing website sources, media registry, and real retrieval test simulator.",
};

export default function KnowledgePage() {
  const sources = loadSources();
  const media = getMediaRegistry();
  const mode = getCurrentEngineMode();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Top sticky header */}
      <header className="sticky top-0 left-0 right-0 w-full z-40 bg-pure-white/95 backdrop-blur-md border-b border-stroke-soft shadow-xs">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-deep-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to demo</span>
            </Link>

            <div className="h-5 w-[1px] bg-stroke-soft hidden sm:block" />

            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Greedy Adventures Logo"
                className="h-8 w-auto object-contain"
              />
              <div className="h-6 w-[1px] bg-stroke-soft hidden sm:block" />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-deep-navy leading-none">
                  Sea View Skydiving
                </span>
                <span className="text-[10px] uppercase font-bold text-tertiary tracking-wider mt-0.5">
                  Chatbot Knowledge View
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-xs text-tertiary border border-stroke-soft">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-deep-navy">RAG Ground Truth</span>
              <span>•</span>
              <span>Read-Only</span>
            </div>
            <ModeBadge mode={mode} compact />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full space-y-10">
        {/* Header summary */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-deep-navy tracking-tight">
                  Chatbot Knowledge Base
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary text-[11px] font-bold uppercase tracking-wider">
                  Read-Only
                </span>
              </div>
              <p className="text-sm text-on-surface-variant max-w-2xl">
                What the assistant can use to answer customer questions. Public website sources and demo media only. Never exposes API keys or private conversations.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <ModeBadge mode={mode} />
            </div>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-pure-white p-4 rounded-2xl border border-stroke-soft shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary block">
                Indexed Sources
              </span>
              <span className="text-2xl font-black text-deep-navy block">
                {sources.length} Pages
              </span>
              <span className="text-[11px] text-tertiary">
                Extracted from live site
              </span>
            </div>

            <div className="bg-pure-white p-4 rounded-2xl border border-stroke-soft shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary block">
                Media Registry
              </span>
              <span className="text-2xl font-black text-deep-navy block">
                {media.length} Active
              </span>
              <span className="text-[11px] text-tertiary">
                1 Demo PDF • 2 Real Videos
              </span>
            </div>

            <div className="bg-pure-white p-4 rounded-2xl border border-stroke-soft shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary block">
                Retrieval Engine
              </span>
              <span className="text-2xl font-black text-sky-blue block">
                BM25 Vector
              </span>
              <span className="text-[11px] text-tertiary">
                In-memory ranking
              </span>
            </div>

            <div className="bg-pure-white p-4 rounded-2xl border border-stroke-soft shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary block">
                Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-2xl font-black text-deep-navy leading-none">
                  Online
                </span>
              </div>
              <span className="text-[11px] text-tertiary">
                Zero database drift
              </span>
            </div>
          </div>
        </section>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sources & Media (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <SourcesList sources={sources} />
            <div className="h-[1px] bg-stroke-soft" />
            <MediaList media={media} />
          </div>

          {/* Right Column: Interactive Test Simulator (5 cols) */}
          <div className="lg:col-span-5">
            <TestPanel />
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full bg-pure-white border-t border-stroke-soft py-6 mt-16 text-center text-xs text-tertiary">
        <p>
          Greedy Adventures Full Stack Prototype • Read-Only Chatbot Knowledge View
        </p>
      </footer>
    </div>
  );
}

