import React from "react";
import { validateUrl } from "@/lib/media/validateUrl";
import { ExternalLink } from "lucide-react";

interface SourceChipProps {
  title: string;
  url: string;
}

export const SourceChip: React.FC<SourceChipProps> = ({ title, url }) => {
  const isValid = validateUrl(url);

  if (!isValid) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-outline text-[11px] font-medium">
        <span>Source: {title}</span>
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-sky-blue hover:text-primary transition-colors text-[11px] font-semibold border border-stroke-soft shadow-xs group"
      title={`Open source: ${title} (${url})`}
    >
      <span className="truncate max-w-[200px]">{title}</span>
      <ExternalLink className="w-3 h-3 shrink-0 text-sky-blue group-hover:translate-x-0.5 transition-transform" />
    </a>
  );
};

