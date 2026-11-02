import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2.5 animate-fadeIn">
      <div className="w-7 h-7 rounded-full bg-sky-blue/20 text-sky-blue flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs font-bold">SV</span>
      </div>
      <div className="max-w-[85%] space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low text-deep-navy rounded-2xl rounded-tl-sm shadow-sm border border-stroke-soft">
          <span className="text-xs font-medium">Sea View Assistant is typing</span>
          <div className="flex items-center gap-1 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-blue animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-blue animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-blue animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>

        {/* Skeleton media card shimmer variant */}
        <div className="w-64 p-3 bg-pure-white rounded-xl shadow-xs border border-stroke-soft space-y-2 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-high" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-surface-container-high rounded w-3/4" />
              <div className="h-2 bg-surface-container-high rounded w-1/2" />
            </div>
          </div>
          <div className="h-14 w-full bg-surface-container-high rounded-lg" />
        </div>
      </div>
    </div>
  );
};

