import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getEngine, getCurrentEngineMode } from "@/lib/chat/getEngine";
import { DemoEngine } from "@/lib/chat/DemoEngine";
import { LiveEngine } from "@/lib/chat/LiveEngine";

describe("Engine Selection & Mode Switching", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.MOCK_MODE;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns DemoEngine with empty keys", () => {
    const engine = getEngine();
    expect(engine).toBeInstanceOf(DemoEngine);
    expect(engine.mode).toBe("demo");
    expect(getCurrentEngineMode()).toBe("demo");
  });

  it("returns LiveEngine when an API key is set", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-key-12345";
    const engine = getEngine();
    expect(engine).toBeInstanceOf(LiveEngine);
    expect(engine.mode).toBe("live");
    expect(getCurrentEngineMode()).toBe("live");
  });

  it("returns DemoEngine when MOCK_MODE=true even if an API key exists", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-key-12345";
    process.env.MOCK_MODE = "true";
    const engine = getEngine();
    expect(engine).toBeInstanceOf(DemoEngine);
    expect(engine.mode).toBe("demo");
    expect(getCurrentEngineMode()).toBe("demo");
  });
});

