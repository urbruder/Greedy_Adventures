"use client";

import React, { useState } from "react";
import { SourceDoc } from "@/lib/knowledge/types";
import { Search, ChevronDown, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

interface SourcesListProps {
  sources: SourceDoc[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(
    sources[0]?.id || null
  );

  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(filter.toLowerCase()) ||
      s.url.toLowerCase().includes(filter.toLowerCase()) ||
      s.text.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
            <FileText className="w-4 h-4 text-sky-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-deep-navy">
              Indexed Website Sources
            </h2>
            <span className="text-xs text-tertiary">
              {sources.length} public pages captured from greedyadventures.com
            </span>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-tertiary" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter pages or text..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest rounded-xl text-xs text-on-surface placeholder:text-tertiary border border-stroke-soft shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-blue"
          />
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredSources.map((source) => {
          const isExpanded = expandedId === source.id;
          const wordCount = source.text.split(/\s+/).length;

          return (
            <div
              key={source.id}
              className="bg-pure-white rounded-2xl shadow-xs border border-stroke-soft overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : source.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-sky-blue mt-0.5 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-deep-navy truncate">
                        {source.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {wordCount} words
                      </span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-sky-blue hover:underline truncate mt-0.5"
                    >
                      <span className="truncate max-w-xs">{source.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="text-[10px] text-tertiary block mt-1 uppercase font-semibold">
                      Captured: {new Date(source.capturedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-tertiary shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-180 text-sky-blue" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-stroke-soft/60 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px] text-tertiary font-semibold uppercase">
                    <span>Parsed Ground Truth Text</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for Retrieval</span>
                    </span>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl font-mono text-xs text-deep-navy leading-relaxed max-h-72 overflow-y-auto whitespace-pre-line border border-stroke-soft">
                    {source.text}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSources.length === 0 && (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-stroke-soft text-xs text-tertiary">
            No sources match &ldquo;{filter}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};
