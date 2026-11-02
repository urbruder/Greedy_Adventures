import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "data"]),
  content: z.string().max(2000, "Message content exceeds maximum allowed length (2000 characters)"),
  id: z.string().optional(),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required")
    .max(50, "Message count exceeds maximum allowed conversation history (50 messages)"),
});

export const testQuestionSchema = z.object({
  question: z
    .string()
    .min(1, "Question cannot be empty")
    .max(1000, "Question exceeds maximum allowed length (1000 characters)"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type TestQuestionRequest = z.infer<typeof testQuestionSchema>;

