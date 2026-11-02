import React from "react";
import { validateUrl } from "@/lib/media/validateUrl";
import { ExternalLink, Video as VideoIcon } from "lucide-react";

interface VideoCardProps {
  title: string;
  url: string;
  sourceUrl?: string;
  isDemo?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  title,
  url,
  sourceUrl = "https://www.greedyadventures.com/experiences/sea-view-skydiving",
  isDemo = false,
}) => {
  const isValidMediaUrl = validateUrl(url);
  const isValidSourceUrl = validateUrl(sourceUrl);

  if (!isValidMediaUrl) {
    return (
      <div className="p-3 bg-error-container/20 text-on-surface rounded-xl border border-error/30 text-xs">
        Video URL failed security allowlist check.
      </div>
    );
  }

  return (
    <div className="w-full bg-pure-white rounded-2xl overflow-hidden shadow-elevated border border-stroke-soft space-y-2">
      <div className="relative w-full aspect-video bg-deep-navy">
        <video
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster="https://lh3.googleusercontent.com/aida-public/AB6AXuDG9Z88FEk96OE9sPc2-0GZ0YCNe_gecIUBE9D-e6z6BuQxynVsUeNpW2ocsIC_HbpSoRc2Xbsr73gAUXFb00zNQBYvXPCOrZ_Gj2R2I35Lg-iZzc2udJXA_aKD3V5N_kxxZRrmwJpmHdstFVBLRb5BhTb8virXdI3MAyx6yHyBwUZTIpPSxxM8Bl7hpUsBb2EaO5G_6CoQ3OzlHpnk8_yxmhPDV3_KCZ5Wn2-D82yB"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full bg-deep-navy/80 backdrop-blur-md text-pure-white text-[10px] font-bold uppercase tracking-wider">
            {isDemo ? "Demo material" : "Official Website Film"}
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <VideoIcon className="w-4 h-4 text-sky-blue shrink-0" />
          <h4 className="font-semibold text-deep-navy text-xs leading-snug truncate">
            {title}
          </h4>
        </div>

        {isValidSourceUrl && (
          <div className="flex items-center justify-between pt-1 border-t border-stroke-soft/60">
            <span className="text-[11px] text-tertiary">13,000 FT Tandem Jump</span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-blue hover:text-primary transition-colors"
            >
              <span>Watch on website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

