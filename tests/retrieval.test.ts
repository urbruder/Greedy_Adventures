import { describe, it, expect } from "vitest";
import { retrieveChunks } from "@/lib/knowledge/retrieve";

describe("BM25 Knowledge Retrieval", () => {
  it("returns Sea View inclusion chunk for 'what is included in the package'", () => {
    const res = retrieveChunks("what is included in the package");
    expect(res.chunks.length).toBeGreaterThan(0);
    expect(res.hasRelevantChunks).toBe(true);
    expect(res.bestScore).toBeGreaterThan(2.0);

    const firstChunk = res.chunks[0];
    const text = firstChunk.text.toLowerCase();
    expect(
      text.includes("included") || text.includes("tandem") || text.includes("pattaya")
    ).toBe(true);
  });

  it("returns chunk containing ฿14,000 for 'price of VIP'", () => {
    const res = retrieveChunks("price of VIP");
    expect(res.chunks.length).toBeGreaterThan(0);
    expect(res.hasRelevantChunks).toBe(true);

    const hasVipPrice = res.chunks.some((c) =>
      c.text.includes("14,000") || c.text.includes("VIP")
    );
    expect(hasVipPrice).toBe(true);
  });

  it("returns Mount Abu India chunk for 'Mount Abu price'", () => {
    const res = retrieveChunks("Mount Abu price");
    expect(res.chunks.length).toBeGreaterThan(0);
    expect(res.hasRelevantChunks).toBe(true);

    const hasIndiaOrAbu = res.chunks.some(
      (c) =>
        c.title.includes("Mount Abu") ||
        c.text.includes("Mount Abu") ||
        c.text.includes("29,999") ||
        c.text.includes("39,999")
    );
    expect(hasIndiaOrAbu).toBe(true);
  });

  it("returns low or no relevance for an unrelated question ('what is the capital of France')", () => {
    const res = retrieveChunks("what is the capital of France");
    expect(res.hasRelevantChunks).toBe(false);
  });
});

