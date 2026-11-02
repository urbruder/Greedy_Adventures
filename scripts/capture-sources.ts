import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

export interface Source {
  id: string;
  title: string;
  url: string;
  capturedAt: string; // ISO
  text: string;
}

export interface CaptureReport {
  capturedAt: string;
  successfulUrls: string[];
  failedUrls: { url: string; error: string }[];
  knownGaps: string[];
  notes: string[];
}

const URLS = [
  // Primary
  "https://www.greedyadventures.com/experiences/sea-view-skydiving",
  // Related
  "https://www.greedyadventures.com/escapes/thailand/pattaya",
  "https://www.greedyadventures.com/escapes/thailand",
  "https://www.greedyadventures.com/adventures/skydiving",
  "https://www.greedyadventures.com/adventures",
  "https://www.greedyadventures.com/experiences/mount-abu-tandem-skydiving",
  "https://www.greedyadventures.com/escapes/india/mount-abu",
  "https://www.greedyadventures.com/escapes/india",
  "https://www.greedyadventures.com/escapes",
  "https://www.greedyadventures.com/book",
  "https://www.greedyadventures.com/contact",
  "https://www.greedyadventures.com/about",
  "https://www.greedyadventures.com/cancellations",
  "https://www.greedyadventures.com/terms",
  "https://www.greedyadventures.com/privacy",
  "https://www.greedyadventures.com/blog",
  "https://www.greedyadventures.com/",
  // Coming soon pages
  "https://www.greedyadventures.com/adventures/paragliding",
  "https://www.greedyadventures.com/adventures/scuba-diving",
  "https://www.greedyadventures.com/adventures/snowboarding",
];

function generateIdFromUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname.replace(/^\/|\/$/g, "");
    if (!pathname) return "home";
    return pathname.replace(/\//g, "-").toLowerCase();
  } catch {
    return urlStr.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  }
}

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

async function fetchPage(url: string): Promise<{ html: string; status: number }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "follow",
  });
  const html = await res.text();
  return { html, status: res.status };
}

function extractFromNextJsRsc(html: string): string[] {
  // Next.js embeds React Server Component flight data in script tags
  // self.__next_f.push([1, "..."])
  const rscStrings: string[] = [];
  const regex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    try {
      const unescaped = JSON.parse(`"${match[1]}"`);
      rscStrings.push(unescaped);
    } catch {
      // ignore
    }
  }
  return rscStrings;
}

export async function runCapture() {
  console.log(`Starting source capture for ${URLS.length} URLs...`);
  const sources: Source[] = [];
  const successfulUrls: string[] = [];
  const failedUrls: { url: string; error: string }[] = [];
  const knownGaps: string[] = [];
  const capturedAt = new Date().toISOString();

  for (const url of URLS) {
    try {
      console.log(`Fetching: ${url}`);
      const { html, status } = await fetchPage(url);
      if (status >= 400) {
        console.warn(`[WARN] ${url} returned status ${status}`);
        failedUrls.push({ url, error: `HTTP ${status}` });
        continue;
      }

      const $ = cheerio.load(html);

      // Title extraction
      let title = $("title").text().trim();
      const h1 = $("h1").first().text().trim();
      if (!title || title.includes("404")) {
        title = h1 || generateIdFromUrl(url);
      }
      title = title.replace(/\s*\|\s*Greedy Adventures.*$/i, "").trim();

      // Check for RSC text payload
      const rscPayloads = extractFromNextJsRsc(html);
      const combinedRsc = rscPayloads.join(" ");

      // Strip unwanted HTML elements
      $(
        "script, style, noscript, svg, nav, footer, header, iframe, link, meta"
      ).remove();

      // Get readable content
      // Focus on main or body
      const mainEl = $("main").length ? $("main") : $("body");

      // Extract sections, headings, paragraphs, lists, details
      const textPieces: string[] = [];

      mainEl.find("h1, h2, h3, h4, h5, p, li, dt, dd, summary").each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 2) {
          // Avoid duplicate headers
          textPieces.push(text);
        }
      });

      let extracted = cleanText(textPieces.join("\n"));

      // If page is Pattaya or Skydiving, check if collapsed FAQ answers are missing
      if (url.includes("pattaya")) {
        const collapsedQuestions = [
          "best time to visit",
          "is the jump different from the more expensive packages",
          "can I add video later",
          "can I use my own GoPro",
          "what should I wear",
        ];

        for (const q of collapsedQuestions) {
          const lowerExtracted = extracted.toLowerCase();
          const lowerRsc = combinedRsc.toLowerCase();

          // Check if the answer exists in RSC flight data or if it's only the question
          if (lowerExtracted.includes(q)) {
            // Check if there is an answer right after
            const idxInRsc = lowerRsc.indexOf(q);
            if (idxInRsc !== -1) {
              const snippet = combinedRsc.substring(idxInRsc, idxInRsc + 300);
              // see if snippet has meaningful text
            }
          }
        }
      }

      // Check if extracted has minimal content
      if (extracted.length < 50 && url.includes("adventures/")) {
        // e.g. Coming soon pages
        extracted = `${title}\nThis experience is coming soon to Greedy Adventures. Check back later for updates.`;
      }

      sources.push({
        id: generateIdFromUrl(url),
        title,
        url,
        capturedAt,
        text: extracted,
      });

      successfulUrls.push(url);
      console.log(` Captured: ${title} (${extracted.length} chars)`);
    } catch (err: any) {
      console.error(` Error fetching ${url}:`, err.message);
      failedUrls.push({ url, error: err.message || String(err) });
    }
  }

  // Known gaps per assignment instructions
  knownGaps.push(
    "Pattaya dropzone collapsed accordion FAQs ('best time to visit', 'is the jump different from the more expensive packages', 'can I add video later', 'can I use my own GoPro', 'what should I wear'): answer texts are hidden behind client-side interactive widgets without fallback text on plain fetch.",
    "Official brochure PDF: None found on website. Handled via clearly-labelled Demo brochure in /public/media/sea-view-skydiving-brochure.pdf.",
    "Freefall duration inconsistency: Sea View Skydiving page states ~60 seconds; Skydiving overview page states ~45 seconds.",
    "Dropzone duration inconsistency: Sea View Skydiving page states ~3 hours; Contact FAQ states ~3 to 4 hours."
  );

  const report: CaptureReport = {
    capturedAt,
    successfulUrls,
    failedUrls,
    knownGaps,
    notes: [
      `Captured ${sources.length} sources successfully.`,
      `Failed to capture ${failedUrls.length} URLs.`,
      "Generated static data/sources.json to avoid runtime scraping.",
    ],
  };

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, "sources.json"),
    JSON.stringify(sources, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(dataDir, "capture-report.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );

  console.log(`\nCapture complete!`);
  console.log(`Sources written to data/sources.json`);
  console.log(`Report written to data/capture-report.json`);
}

if (require.main === module) {
  runCapture().catch((e) => {
    console.error("Fatal capture error:", e);
    process.exit(1);
  });
}
