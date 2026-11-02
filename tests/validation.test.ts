import { describe, it, expect } from "vitest";
import { chatRequestSchema, testQuestionSchema } from "@/lib/validation/schemas";

describe("Zod API Request Validation", () => {
  it("accepts valid chat messages", () => {
    const valid = {
      messages: [
        { role: "user", content: "What is included in the package?" },
      ],
    };
    const res = chatRequestSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects empty messages array", () => {
    const invalid = { messages: [] };
    const res = chatRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects invalid role type", () => {
    const invalid = {
      messages: [{ role: "hacker", content: "hello" }],
    };
    const res = chatRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects oversized message content (> 2000 chars)", () => {
    const longString = "a".repeat(2050);
    const invalid = {
      messages: [{ role: "user", content: longString }],
    };
    const res = chatRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("validates test question schema properly", () => {
    expect(testQuestionSchema.safeParse({ question: "Valid" }).success).toBe(
      true
    );
    expect(testQuestionSchema.safeParse({ question: "" }).success).toBe(false);
    expect(
      testQuestionSchema.safeParse({ question: "a".repeat(1200) }).success
    ).toBe(false);
  });
});

