import { describe, it, expect } from "vitest";
import { LiveEngine } from "@/lib/chat/LiveEngine";

describe("LiveEngine Failure & Grounding", () => {
  it("surfaces clear error and enables fallback when model throws", async () => {
    // Create a mock model that throws an error
    const faultyModel = {
      doGenerate: async () => {
        throw new Error("Simulated API 500 error / rate limit exceeded");
      },
    };

    const engine = new LiveEngine(faultyModel as any);
    const res = await engine.generateAnswer([
      { role: "user", content: "What is included in the package?" },
    ]);

    expect(res.error).toBeDefined();
    expect(res.fallbackAvailable).toBe(true);
    expect(res.mode).toBe("live");
    // Ensure no sensitive credentials leaked in text
    expect(res.text.includes("API key")).toBe(false);
  });
});

