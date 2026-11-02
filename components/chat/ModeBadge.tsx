import React from "react";

interface ModeBadgeProps {
  mode: "demo" | "live";
  className?: string;
  compact?: boolean;
}

export const ModeBadge: React.FC<ModeBadgeProps> = ({ mode, className = "", compact = false }) => {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          mode === "live"
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
        } ${className}`}
        title={
          mode === "live"
            ? "Live AI mode: Powered by AI model"
            : "Knowledge Base: Answers built directly from official website sources"
        }
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-sky-400"
          }`}
        />
        <span>{mode === "live" ? "Live AI" : "Knowledge Base"}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
        mode === "live"
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : "bg-sky-50 text-sky-900 border border-sky-200"
      } ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          mode === "live" ? "bg-emerald-500 animate-pulse" : "bg-sky-500"
        }`}
      />
      <span>
        {mode === "live"
          ? "Live AI: Connected to model provider"
          : "Knowledge Base: Answers retrieved directly from official website sources"}
      </span>
    </div>
  );
};

