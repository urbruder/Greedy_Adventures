import { describe, it, expect } from "vitest";
import { DemoEngine } from "@/lib/chat/DemoEngine";

describe("DemoEngine Behavior", () => {
  const engine = new DemoEngine();

  it("answers 'What is included in the package?' with text and source link", async () => {
    const res = await engine.generateAnswer([
      { role: "user", content: "What is included in the package?" },
    ]);

    expect(res.text.length).toBeGreaterThan(20);
    expect(res.text.toLowerCase()).toContain("included");
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.text).toContain("https://www.greedyadventures.com/");
    expect(res.media.pdf).toBeNull();
    expect(res.media.video).toBeNull();
  });

  it("answers 'Can you send me a brochure?' with PDF brochure card", async () => {
    const res = await engine.generateAnswer([
      { role: "user", content: "Can you send me a brochure?" },
    ]);

    expect(res.media.pdf).not.toBeNull();
    expect(res.media.pdf?.type).toBe("pdf");
    expect(res.media.pdf?.isDemo).toBe(true);
    expect(res.text.toLowerCase()).toContain("brochure");
  });

  it("answers 'Can I see a video of the experience?' with Video card", async () => {
    const res = await engine.generateAnswer([
      { role: "user", content: "Can I see a video of the experience?" },
    ]);

    expect(res.media.video).not.toBeNull();
    expect(res.media.video?.type).toBe("video");
    expect(res.text.toLowerCase()).toContain("video");
  });

  it("answers 'Send me the brochure and a video.' with both media artifacts", async () => {
    const res = await engine.generateAnswer([
      { role: "user", content: "Send me the brochure and a video." },
    ]);

    expect(res.media.pdf).not.toBeNull();
    expect(res.media.video).not.toBeNull();
  });

  it("resolves conversational follow-up: 'tell me about DELUXE' then 'how much is it?'", async () => {
    const messages = [
      { role: "user" as const, content: "Tell me about the DELUXE package" },
      {
        role: "assistant" as const,
        content:
          "The DELUXE package includes tandem skydiving with video and photos included.",
      },
      { role: "user" as const, content: "How much is it?" },
    ];

    const res = await engine.generateAnswer(messages);
    expect(res.text).toContain("12,500");
    expect(res.text).toContain("DELUXE");
    expect(res.sources.length).toBeGreaterThan(0);
  });

  it("returns honest message when asked about uncaptured collapsed FAQ (e.g. GoPro)", async () => {
    const res = await engine.generateAnswer([
      { role: "user", content: "Can I use my own GoPro during the jump?" },
    ]);

    expect(res.text.toLowerCase()).toContain("don't have");
    expect(res.text).toContain("+91 95357 68554");
  });

  it("surfaces conflicting facts when asked about freefall duration", async () => {
    const res = await engine.generateAnswer([
      { role: "user", content: "How long is the freefall in seconds?" },
    ]);

    // Should mention both ~60s and ~45s and cite differing pages
    expect(res.text).toContain("60 seconds");
    expect(res.text).toContain("45 seconds");
    expect(res.text.toLowerCase()).toContain("vary");
    expect(res.text).toContain("WhatsApp");
  });
});

