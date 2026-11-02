export interface SourceDoc {
  id: string;
  title: string;
  url: string;
  capturedAt: string;
  text: string;
}

export interface Chunk {
  id: string;
  sourceId: string;
  title: string;
  url: string;
  text: string;
  score?: number;
}

export interface RetrievalResult {
  chunks: Chunk[];
  bestScore: number;
  hasRelevantChunks: boolean;
  query: string;
}

