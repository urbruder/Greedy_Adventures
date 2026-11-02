import { AnswerEngine } from "./types";
import { DemoEngine } from "./DemoEngine";
import { LiveEngine } from "./LiveEngine";

export function getEngine(): AnswerEngine {
  if (process.env.MOCK_MODE === "true") {
    return new DemoEngine();
  }

  const hasKey = Boolean(
    process.env.ANTHROPIC_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
  );

  if (hasKey) {
    return new LiveEngine();
  }

  return new DemoEngine();
}

export function getCurrentEngineMode(): "demo" | "live" {
  if (process.env.MOCK_MODE === "true") {
    return "demo";
  }
  const hasKey = Boolean(
    process.env.ANTHROPIC_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
  );
  return hasKey ? "live" : "demo";
}

