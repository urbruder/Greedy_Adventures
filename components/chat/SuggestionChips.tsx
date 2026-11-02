import React from "react";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export const SUGGESTIONS = [
  "What is included in the package?",
  "Send me the brochure",
  "Show me a video",
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-deep-navy text-xs font-semibold transition-colors border border-stroke-soft shadow-xs shrink-0 disabled:opacity-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

