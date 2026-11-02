import React from "react";
import { Media } from "@/lib/media/types";
import { FileText, Video, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

interface MediaListProps {
  media: Media[];
}

export const MediaList: React.FC<MediaListProps> = ({ media }) => {
  const pdfs = media.filter((m) => m.type === "pdf");
  const videos = media.filter((m) => m.type === "video");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-deep-navy">Ground Truth Media Registry</h2>
        <p className="text-xs text-tertiary">
          Registered PDF documents and videos eligible for deterministic citation or tool dispatch.
        </p>
      </div>

      {/* Group A: PDFs */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary block">
          Group A: Registered Documents (PDFs)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="p-4 rounded-2xl bg-pure-white border border-stroke-soft shadow-xs flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase">
                      Brochure
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        pdf.available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {pdf.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-deep-navy leading-snug">
                    {pdf.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                    {pdf.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-stroke-soft flex items-center justify-between">
                <span className="text-[11px] text-tertiary font-mono truncate max-w-[150px]">
                  {pdf.url}
                </span>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-blue hover:underline"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group B: Videos */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary block">
          Group B: Registered Video Artifacts
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((vid) => {
            const thumbUrl = vid.id.includes("mount-abu")
              ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDd7sHyPDQlKlnvwUaK_0j0GwXUoxvh8Veh-_zf0kedJH9BcNLZq9mglTaJPJgrjbAIN6i2LllC6QxfnhUSU_WXPRwAMRBYFnnes6d3F9loMwPw_kdOmxE0NoHOqacWcu4gscKV1g10pF6SEf09qxKg8K8MqP1PjL1x6SIZ1lMLsDzTqZTWCVSREu7pmd5YbYOVWgebAVDVfDrgdPglqCFaw8kXBnNMtJ4ZhYmc2WOa"
              : "https://lh3.googleusercontent.com/aida-public/AB6AXuCJTaF3_pJMKa4TEirKai2LuawFeUiTdxbHNRCZ3AYx_sQN2jpWkLhzQkBw1eTOIHxjxDnpD1aqFndRryx9-9QgW77oAeJbdEvyA4-a5Df2U2DiVp72WmyykDELTDoSWu-TsHNmuym1N8Bx-mThqQheTeN2dPe4AnQwvbJ6XDVDuGlZfyPMt2ZSSf68CojaMF-_NBpF7EgeoGv-8Bf14noxGOwDAhBzzF67jgonvknx";

            return (
              <div
                key={vid.id}
                className="rounded-2xl bg-pure-white border border-stroke-soft shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Stitch Video Still Thumbnail */}
                <div className="relative w-full aspect-video bg-deep-navy overflow-hidden">
                  <img
                    src={thumbUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-pure-white">
                    {vid.available ? "Available" : "Unavailable"}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-deep-navy/80 text-pure-white text-[10px] font-bold">
                    HD Film
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-deep-navy leading-snug">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {vid.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stroke-soft flex items-center justify-between">
                    <span className="text-[11px] text-tertiary font-mono truncate max-w-[150px]">
                      {vid.url}
                    </span>
                    <a
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-blue hover:underline"
                    >
                      <span>Watch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

