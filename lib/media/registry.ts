import mediaData from "@/data/media.json";
import { Media } from "./types";

let cachedMedia: Media[] | null = null;

export function getMediaRegistry(): Media[] {
  if (cachedMedia) {
    return cachedMedia;
  }
  cachedMedia = (mediaData as Media[]).map((m) => ({ ...m }));
  return cachedMedia;
}

export function getMediaById(id: string): Media | undefined {
  const registry = getMediaRegistry();
  return registry.find((m) => m.id === id);
}

export function getMediaByType(type: "pdf" | "video"): Media | undefined {
  const registry = getMediaRegistry();
  return registry.find((m) => m.type === type && m.available);
}

/**
 * For testing fallback behavior, allow mutating/resetting registry in tests
 */
export function setMediaRegistryForTesting(media: Media[]) {
  cachedMedia = media;
}

export function resetMediaRegistryForTesting() {
  cachedMedia = null;
}

