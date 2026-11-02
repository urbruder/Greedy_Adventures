import { describe, it, expect } from "vitest";
import { validateUrl } from "@/lib/media/validateUrl";

describe("validateUrl Security Checker", () => {
  it("allows internal relative URLs starting with /", () => {
    expect(validateUrl("/media/sea-view-skydiving-brochure.pdf")).toBe(true);
    expect(validateUrl("/images/hero.jpg")).toBe(true);
  });

  it("allows allowlisted HTTPS greedyadventures.com URLs", () => {
    expect(
      validateUrl(
        "https://www.greedyadventures.com/experiences/sea-view-skydiving"
      )
    ).toBe(true);
    expect(
      validateUrl(
        "https://www.greedyadventures.com/greedy/films/sea-view-studio-hero.mp4"
      )
    ).toBe(true);
    expect(
      validateUrl(
        "https://greedyadventures.com/experiences/mount-abu-tandem-skydiving"
      )
    ).toBe(true);
  });

  it("rejects non-https URLs (http:, ftp:)", () => {
    expect(
      validateUrl(
        "http://www.greedyadventures.com/experiences/sea-view-skydiving"
      )
    ).toBe(false);
  });

  it("rejects non-allowlisted third party domains", () => {
    expect(validateUrl("https://evil-site.com/malicious.pdf")).toBe(false);
    expect(validateUrl("https://phishing.com/video.mp4")).toBe(false);
  });

  it("rejects dangerous protocol schemes like javascript: or data:", () => {
    expect(validateUrl("javascript:alert(1)")).toBe(false);
    expect(validateUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(validateUrl("vbscript:msgbox(1)")).toBe(false);
  });

  it("rejects protocol-relative URLs", () => {
    expect(validateUrl("//evil.com/payload.js")).toBe(false);
  });
});

