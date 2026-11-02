import { describe, it, expect } from "vitest";
import { retrieveChunks } from "@/lib/knowledge/retrieve";
import { selectMedia } from "@/lib/media/selectMedia";
import { DemoEngine } from "@/lib/chat/DemoEngine";

describe("Chat Pipeline and Knowledge Test Alignment", () => {
  it("knowledge test functions produce identical chunks and media as chat pipeline for the same question", async () => {
    const question = "Can you send me a brochure?";

    // Pipeline 1: What knowledge test runs
    const testChunks = retrieveChunks(question).chunks;
    const testMedia = selectMedia(question);

    // Pipeline 2: What chat engine runs
    const engine = new DemoEngine();
    const chatResult = await engine.generateAnswer([
      { role: "user", content: question },
    ]);

    // Check media selection matches
    expect(testMedia.pdf?.url).toEqual(chatResult.media.pdf?.url);
    expect(testMedia.video?.url).toEqual(chatResult.media.video?.url);

    // Check top retrieved chunk is identical
    const chatTopChunk = retrieveChunks(question).chunks[0];
    expect(testChunks[0]?.id).toEqual(chatTopChunk?.id);
    expect(testChunks[0]?.title).toEqual(chatTopChunk?.title);
  });
});

