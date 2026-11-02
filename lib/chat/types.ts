import { Chunk } from "@/lib/knowledge/types";
import { Media } from "@/lib/media/types";

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "data";
  content: string;
  id?: string;
}

export interface SourceReference {
  title: string;
  url: string;
}

export interface EngineResult {
  text: string;
  sources: SourceReference[];
  media: {
    pdf: Media | null;
    video: Media | null;
  };
  mode: "demo" | "live";
  traceId: string;
  error?: string;
  fallbackAvailable?: boolean;
}

export interface TraceRecord {
  traceId: string;
  timestamp: string;
  question: string;
  mode: "demo" | "live";
  chunks: Chunk[];
  mediaSelected: {
    pdf: Media | null;
    video: Media | null;
  };
  answer: string;
}

export interface AnswerEngine {
  readonly mode: "demo" | "live";
  generateAnswer(messages: ChatMessage[]): Promise<EngineResult>;
}

