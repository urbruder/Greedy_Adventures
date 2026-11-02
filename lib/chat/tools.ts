import { getMediaRegistry } from "@/lib/media/registry";

export interface ToolResult {
  available: boolean;
  item?: any;
  reason?: string;
}

export function executeSendBrochure(): ToolResult {
  const registry = getMediaRegistry();
  const pdfItem = registry.find((m) => m.type === "pdf");
  if (pdfItem && pdfItem.available) {
    return {
      available: true,
      item: pdfItem,
    };
  }
  return {
    available: false,
    reason: "The brochure is currently unavailable.",
  };
}

export function executeSendVideo(): ToolResult {
  const registry = getMediaRegistry();
  const videoItem = registry.find((m) => m.type === "video");
  if (videoItem && videoItem.available) {
    return {
      available: true,
      item: videoItem,
    };
  }
  return {
    available: false,
    reason: "The requested video is currently unavailable.",
  };
}

