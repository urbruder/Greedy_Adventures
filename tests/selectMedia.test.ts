import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { selectMedia } from "@/lib/media/selectMedia";
import {
  setMediaRegistryForTesting,
  resetMediaRegistryForTesting,
  getMediaRegistry,
} from "@/lib/media/registry";

describe("selectMedia Deterministic Selection", () => {
  beforeEach(() => {
    resetMediaRegistryForTesting();
  });

  afterEach(() => {
    resetMediaRegistryForTesting();
  });

  it("selects pdf when user mentions 'brochure'", () => {
    const res = selectMedia("Can you send me a brochure?");
    expect(res.requestedTypes).toContain("pdf");
    expect(res.requestedTypes).not.toContain("video");
    expect(res.pdf).not.toBeNull();
    expect(res.pdf?.type).toBe("pdf");
    expect(res.pdf?.url).toBe("/media/sea-view-skydiving-brochure.pdf");
    expect(res.video).toBeNull();
  });

  it("selects video when user mentions 'video'", () => {
    const res = selectMedia("Can I see a video of the experience?");
    expect(res.requestedTypes).toContain("video");
    expect(res.requestedTypes).not.toContain("pdf");
    expect(res.video).not.toBeNull();
    expect(res.video?.type).toBe("video");
    expect(res.video?.url).toContain(".mp4");
    expect(res.pdf).toBeNull();
  });

  it("selects both when user asks for 'brochure and a video'", () => {
    const res = selectMedia("Send me the brochure and a video.");
    expect(res.requestedTypes).toContain("pdf");
    expect(res.requestedTypes).toContain("video");
    expect(res.pdf).not.toBeNull();
    expect(res.video).not.toBeNull();
  });

  it("selects none when user asks general questions like 'what is included'", () => {
    const res = selectMedia("What is included in the package?");
    expect(res.requestedTypes).toHaveLength(0);
    expect(res.pdf).toBeNull();
    expect(res.video).toBeNull();
  });

  it("handles fallback honestly when media item is unavailable or missing", () => {
    // Set registry with pdf unavailable
    setMediaRegistryForTesting([
      {
        id: "sea-view-brochure",
        type: "pdf",
        title: "Sea View Brochure",
        url: "/media/sea-view-skydiving-brochure.pdf",
        isDemo: true,
        available: false, // unavailable
      },
      {
        id: "sea-view-hero-video",
        type: "video",
        title: "Sea View Hero Film",
        url: "https://www.greedyadventures.com/greedy/films/sea-view-studio-hero.mp4",
        isDemo: false,
        available: false, // unavailable
      },
    ]);

    const res = selectMedia("Send me the brochure and a video.");
    expect(res.pdf).toBeNull();
    expect(res.video).toBeNull();
    expect(res.unavailabilityNotices.length).toBeGreaterThan(0);
    expect(res.unavailabilityNotices.some((n) => n.includes("brochure"))).toBe(true);
    expect(res.unavailabilityNotices.some((n) => n.includes("video"))).toBe(true);
  });
});

