import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorBannerProps {
  message?: string;
  onRetry: () => void;
  onFallbackToDemo?: () => void;
  canFallbackToDemo?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message = "Something went wrong communicating with the assistant. Please try again.",
  onRetry,
  onFallbackToDemo,
  canFallbackToDemo = false,
}) => {
  return (
    <div className="p-3.5 bg-red-50 text-red-900 rounded-xl border border-red-200 shadow-xs flex flex-col gap-2.5">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-snug font-medium flex-1">{message}</p>
      </div>

      <div className="flex items-center gap-2 self-end">
        {canFallbackToDemo && onFallbackToDemo && (
          <button
            type="button"
            onClick={onFallbackToDemo}
            className="px-3 py-1 rounded-full bg-white text-deep-navy border border-stroke-soft text-xs font-semibold hover:bg-surface-container transition-colors"
          >
            Switch to Demo Mode
          </button>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
};

