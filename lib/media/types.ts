export type MediaType = "pdf" | "video";

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  url: string;
  isDemo: boolean;
  available: boolean;
  sourceUrl?: string;
  description?: string;
}

export interface MediaSelectionResult {
  pdf: Media | null;
  video: Media | null;
  requestedTypes: MediaType[];
  unavailabilityNotices: string[];
}

