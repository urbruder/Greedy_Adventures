import sourcesData from "@/data/sources.json";
import { SourceDoc } from "./types";

let cachedSources: SourceDoc[] | null = null;

export function loadSources(): SourceDoc[] {
  if (cachedSources) {
    return cachedSources;
  }

  cachedSources = sourcesData as SourceDoc[];
  return cachedSources;
}

