import { SourceDoc, Chunk } from "./types";

const TARGET_CHUNK_SIZE = 700;
const OVERLAP_SIZE = 150;

/**
 * Splits source text into overlapping chunks of approx 500-800 chars.
 * Splits on paragraphs or sentences where possible.
 */
export function chunkSource(source: SourceDoc): Chunk[] {
  const text = source.text.trim();
  if (!text) return [];

  // Split into natural blocks by double newline or single newline
  const paragraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  const chunks: Chunk[] = [];
  let currentText = "";
  let chunkIndex = 0;

  for (const para of paragraphs) {
    if (currentText.length + para.length + 1 > TARGET_CHUNK_SIZE && currentText.length > 200) {
      chunks.push({
        id: `${source.id}_c${chunkIndex++}`,
        sourceId: source.id,
        title: source.title,
        url: source.url,
        text: currentText.trim(),
      });

      // Retain overlap from end of current text
      const sliceStart = Math.max(0, currentText.length - OVERLAP_SIZE);
      currentText = currentText.slice(sliceStart) + "\n" + para;
    } else {
      currentText = currentText ? `${currentText}\n${para}` : para;
    }
  }

  if (currentText.trim().length > 0) {
    chunks.push({
      id: `${source.id}_c${chunkIndex++}`,
      sourceId: source.id,
      title: source.title,
      url: source.url,
      text: currentText.trim(),
    });
  }

  return chunks;
}

export function chunkAllSources(sources: SourceDoc[]): Chunk[] {
  const allChunks: Chunk[] = [];
  for (const source of sources) {
    allChunks.push(...chunkSource(source));
  }
  return allChunks;
}

