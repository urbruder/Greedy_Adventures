import { NextResponse } from "next/server";
import { loadSources } from "@/lib/knowledge/loadSources";
import { getMediaRegistry } from "@/lib/media/registry";
import { getCurrentEngineMode } from "@/lib/chat/getEngine";

export async function GET() {
  try {
    const sources = loadSources();
    const media = getMediaRegistry();
    const mode = getCurrentEngineMode();

    return NextResponse.json({
      sources,
      media,
      currentMode: mode,
    });
  } catch (err: any) {
    console.error("[GET /api/knowledge error]", err.message);
    return NextResponse.json(
      { error: "Failed to load knowledge base." },
      { status: 500 }
    );
  }
}

