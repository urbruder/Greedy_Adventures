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
            : "bg-sunrise-orange/20 text-sunrise-orange border border-sunrise-orange/40"
        } ${className}`}
        title={
          mode === "live"
            ? "Live AI mode: Powered by AI SDK model"
            : "Demo mode: no AI key, answers built directly from website sources"
        }
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-sunrise-orange"
          }`}
        />
        <span>{mode === "live" ? "Live AI" : "Demo Mode"}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
        mode === "live"
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : "bg-amber-50 text-amber-900 border border-amber-200"
      } ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          mode === "live" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
        }`}
      />
      <span>
        {mode === "live"
          ? "Live AI: Connected to model provider"
          : "Demo mode: no AI key, answers built directly from website sources"}
      </span>
    </div>
  );
};

