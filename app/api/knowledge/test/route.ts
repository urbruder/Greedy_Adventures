import { NextRequest, NextResponse } from "next/server";
import { testQuestionSchema } from "@/lib/validation/schemas";
import { retrieveChunks } from "@/lib/knowledge/retrieve";
import { selectMedia } from "@/lib/media/selectMedia";
import { getEngine, getCurrentEngineMode } from "@/lib/chat/getEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = testQuestionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request: " + parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { question } = parseResult.data;

    // Run identical retrieval pipeline as /api/chat
    const retrieval = retrieveChunks(question);

    // Run identical deterministic media selection as /api/chat
    const mediaSelected = selectMedia(question);

    // Run engine to get the exact answer preview
    const engine = getEngine();
    const engineResponse = await engine.generateAnswer([
      { role: "user", content: question },
    ]);

    const mode = getCurrentEngineMode();

    return NextResponse.json({
      mode,
      chunks: retrieval.chunks,
      mediaSelected: {
        pdf: mediaSelected.pdf,
        video: mediaSelected.video,
        requestedTypes: mediaSelected.requestedTypes,
        unavailabilityNotices: mediaSelected.unavailabilityNotices,
      },
      answerPreview: engineResponse.text,
      bestScore: retrieval.bestScore,
      hasRelevantChunks: retrieval.hasRelevantChunks,
    });
  } catch (err: any) {
    console.error("[POST /api/knowledge/test error]", err.message);
    return NextResponse.json(
      { error: "Failed to run retrieval test." },
      { status: 500 }
    );
  }
}

