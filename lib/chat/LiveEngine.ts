import { AnswerEngine, ChatMessage, EngineResult, SourceReference } from "./types";
import { retrieveChunks } from "@/lib/knowledge/retrieve";
import { selectMedia } from "@/lib/media/selectMedia";
import { buildSystemPrompt } from "./systemPrompt";
import { executeSendBrochure, executeSendVideo } from "./tools";
import { saveTrace } from "./traceStore";
import { Media } from "@/lib/media/types";
import { generateText, tool } from "ai";
import { z } from "zod";

export class LiveEngine implements AnswerEngine {
  readonly mode = "live" as const;
  private model: any;

  constructor(customModel?: any) {
    this.model = customModel;
  }

  private async getModel() {
    if (this.model) return this.model;

    const provider = process.env.MODEL_PROVIDER?.toLowerCase();
    if (provider === "anthropic" || process.env.ANTHROPIC_API_KEY) {
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      return anthropic("claude-3-5-sonnet-20241022");
    } else {
      const { createOpenAI } = await import("@ai-sdk/openai");
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openai("gpt-4o-mini");
    }
  }

  async generateAnswer(messages: ChatMessage[]): Promise<EngineResult> {
    const traceId = `trace_live_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const rawQuestion = lastUserMsg?.content || "";
    const question = rawQuestion.trim();

    // Carry over context from previous discussion
    let contextSummary = "";
    const prevMessages = messages.slice(0, -1);
    for (const msg of prevMessages) {
      const lower = msg.content.toLowerCase();
      if (lower.includes("deluxe")) contextSummary += " deluxe package";
      if (lower.includes("vip")) contextSummary += " vip package";
      if (lower.includes("eco")) contextSummary += " eco package";
      if (lower.includes("mount abu") || lower.includes("india")) contextSummary += " mount abu india";
      if (lower.includes("pattaya") || lower.includes("thailand")) contextSummary += " pattaya thailand";
    }

    // Run real retrieval
    const retrieval = retrieveChunks(question, contextSummary, 5);
    const systemPrompt = buildSystemPrompt(retrieval.chunks);

    const deterministicMedia = selectMedia(question);
    let selectedPdf: Media | null = deterministicMedia.pdf;
    let selectedVideo: Media | null = deterministicMedia.video;

    const sources: SourceReference[] = retrieval.chunks.map((c) => ({
      title: c.title,
      url: c.url,
    }));

    try {
      const modelInstance = await this.getModel();

      const { text, toolResults } = await generateText({
        model: modelInstance,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role === "data" ? "system" : m.role,
          content: m.content,
        })),
        tools: {
          send_brochure: tool({
            description: "Provides the official Sea View Skydiving experience brochure PDF.",
            parameters: z.object({}),
            execute: async () => {
              const res = executeSendBrochure();
              if (res.available && res.item) {
                selectedPdf = res.item;
              }
              return res;
            },
          }),
          send_video: tool({
            description: "Provides the official Sea View Skydiving jump video.",
            parameters: z.object({}),
            execute: async () => {
              const res = executeSendVideo();
              if (res.available && res.item) {
                selectedVideo = res.item;
              }
              return res;
            },
          }),
        },
      });

      const result: EngineResult = {
        text,
        sources,
        media: {
          pdf: selectedPdf,
          video: selectedVideo,
        },
        mode: "live",
        traceId,
      };

      saveTrace({
        traceId,
        timestamp: new Date().toISOString(),
        question,
        mode: "live",
        chunks: retrieval.chunks,
        mediaSelected: {
          pdf: selectedPdf,
          video: selectedVideo,
        },
        answer: text,
      });

      return result;
    } catch (err: any) {
      // Safe, non-leaky error handling
      console.error("[LiveEngine Error]", err.message || err);

      return {
        text: "The AI service encountered an error processing your request. You can retry or switch back to Demo mode.",
        sources,
        media: {
          pdf: selectedPdf,
          video: selectedVideo,
        },
        mode: "live",
        traceId,
        error: "AI model call failed. Please check credentials or retry.",
        fallbackAvailable: true,
      };
    }
  }
}

