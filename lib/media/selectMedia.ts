import { getMediaRegistry } from "./registry";
import { Media, MediaSelectionResult, MediaType } from "./types";

const PDF_KEYWORDS = ["brochure", "pdf", "pamphlet"];
const VIDEO_KEYWORDS = ["video", "watch", "film", "footage"];

export function selectMedia(question: string): MediaSelectionResult {
  const lower = question.toLowerCase();
  const requestedTypes: MediaType[] = [];

  const wantsPdf = PDF_KEYWORDS.some((kw) => lower.includes(kw));
  const wantsVideo = VIDEO_KEYWORDS.some((kw) => lower.includes(kw));

  if (wantsPdf) requestedTypes.push("pdf");
  if (wantsVideo) requestedTypes.push("video");

  const registry = getMediaRegistry();
  const unavailabilityNotices: string[] = [];

  let selectedPdf: Media | null = null;
  let selectedVideo: Media | null = null;

  if (wantsPdf) {
    const pdfItem = registry.find((m) => m.type === "pdf");
    if (pdfItem && pdfItem.available) {
      selectedPdf = pdfItem;
    } else {
      unavailabilityNotices.push("The requested brochure is currently unavailable.");
    }
  }

  if (wantsVideo) {
    const videoItem = registry.find((m) => m.type === "video");
    if (videoItem && videoItem.available) {
      selectedVideo = videoItem;
    } else {
      unavailabilityNotices.push("The requested video is currently unavailable.");
    }
  }

  return {
    pdf: selectedPdf,
    video: selectedVideo,
    requestedTypes,
    unavailabilityNotices,
  };
}

