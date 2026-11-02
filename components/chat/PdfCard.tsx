import React from "react";
import { validateUrl } from "@/lib/media/validateUrl";
import { FileText, Eye, Download } from "lucide-react";

interface PdfCardProps {
  title: string;
  url: string;
  isDemo?: boolean;
}

export const PdfCard: React.FC<PdfCardProps> = ({ title, url, isDemo = true }) => {
  const isValid = validateUrl(url);

  if (!isValid) {
    return (
      <div className="p-3 bg-error-container/20 text-on-surface rounded-xl border border-error/30 text-xs">
        Brochure URL failed security validation.
      </div>
    );
  }

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sea-View-Skydiving-Brochure-Demo.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-pure-white rounded-2xl p-4 shadow-elevated border border-stroke-soft space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-deep-navy text-sm leading-snug line-clamp-1">
              {title}
            </h4>
            <span className="text-[11px] text-tertiary block mt-0.5">
              PDF Document • Official Specs
            </span>
          </div>
        </div>
        {isDemo && (
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider shrink-0">
            Demo material
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-sky-blue hover:bg-sky-blue/90 text-pure-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Open</span>
        </a>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-surface-container-low hover:bg-surface-container text-deep-navy text-xs font-semibold transition-colors border border-stroke-soft"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

