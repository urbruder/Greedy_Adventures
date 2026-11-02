# Sea View Skydiving — Full Stack Developer Assignment (Round 1)

A Next.js + TypeScript prototype for the **Sea View Skydiving** experience (Pattaya, Thailand) by Greedy Adventures. Redesigned with a premium airy theme matching Stitch project `11412627557744195813`, connected to an in-memory RAG chatbot, real deterministic media delivery, and a dedicated read-only Knowledge View.

---

## 1. Quick Setup & Environment Variables

The project is **Vercel-ready** and runs out-of-the-box with **zero environment variables required**. By default, it operates in fully labelled **Demo Mode**, utilizing real BM25 retrieval and deterministic media dispatch over captured website ground truth.

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run automated test suite (Vitest)
npm test

# 4. Run type check & linter
npx tsc --noEmit
npm run lint

# 5. Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration (`.env.example`)

A committed `.env.example` file is included in the project root:

```env
# Leave empty to run in labelled Demo mode (no AI model is called).
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Optional: anthropic | openai (only used when a key is present)
MODEL_PROVIDER=

# Optional override: true forces demo mode even if a key exists
MOCK_MODE=
```

> **Model Spend Notice**: Do not make paid API calls without prior confirmation with Greedy Adventures. To enable Live AI mode later, simply provide `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `.env.local` without making any code changes.

---

## 2. Content Sources & Capture Summary

All content was captured directly from `https://www.greedyadventures.com` using `scripts/capture-sources.ts` (Cheerio + Next.js RSC payload parser) and committed to `data/sources.json`. No runtime scraping occurs.

- **Capture Date**: `2026-11-02T09:13:06.741Z`
- **Total Pages Ingested**: 20 URLs

### Captured URLs List:
1. `https://www.greedyadventures.com/experiences/sea-view-skydiving` (Primary experience page)
2. `https://www.greedyadventures.com/escapes/thailand/pattaya`
3. `https://www.greedyadventures.com/escapes/thailand`
4. `https://www.greedyadventures.com/adventures/skydiving`
5. `https://www.greedyadventures.com/adventures`
6. `https://www.greedyadventures.com/experiences/mount-abu-tandem-skydiving`
7. `https://www.greedyadventures.com/escapes/india/mount-abu`
8. `https://www.greedyadventures.com/escapes/india`
9. `https://www.greedyadventures.com/escapes`
10. `https://www.greedyadventures.com/book`
11. `https://www.greedyadventures.com/contact`
12. `https://www.greedyadventures.com/about`
13. `https://www.greedyadventures.com/cancellations`
14. `https://www.greedyadventures.com/terms`
15. `https://www.greedyadventures.com/privacy`
16. `https://www.greedyadventures.com/blog`
17. `https://www.greedyadventures.com/` (Home)
18. `https://www.greedyadventures.com/adventures/paragliding` (Coming soon)
19. `https://www.greedyadventures.com/adventures/scuba-diving` (Coming soon)
20. `https://www.greedyadventures.com/adventures/snowboarding` (Coming soon)

### Known Gaps Recorded in `data/capture-report.json`:
- **Collapsed FAQ Accordions**: On the Pattaya dropzone escape page, questions such as *"best time to visit"*, *"is the jump different from the more expensive packages"*, *"can I add video later"*, *"can I use my own GoPro"*, and *"what should I wear"* appear without answers in server-rendered HTML. Rather than inventing answers, the system marks them as known gaps; the assistant honestly informs the user that this information was in an unrendered collapsed section and recommends messaging WhatsApp.
- **Brochure PDF**: No official brochure PDF was found on the live website. A clearly labelled sample brochure was generated with `pdf-lib` and saved to `public/media/sea-view-skydiving-brochure.pdf` labelled `(Demo material)`.

---

## 3. Agent Architecture & Flow

```
User Query (Chat Panel or Test Simulator)
                │
                ▼
        Zod Validation
                │
        ┌───────┴────────────────────────┐
        ▼                                ▼
Intent Media Selector           BM25 Vector Retrieval
(selectMedia)                   (retrieveChunks)
Deterministic matching          Ranked in-memory scoring
• brochure/pdf -> PDF           • Boosts primary experience
• video/film -> Video           • Stopword filtering
• both -> Both                  • Threshold check
        │                                │
        └───────┬────────────────────────┘
                ▼
           getEngine()
     ┌──────────┴──────────┐
     ▼                     ▼
DemoEngine (Default)   LiveEngine (Key Present)
• Grounded extraction  • Grounded system prompt
• Follow-up resolution • Vercel AI SDK tools
• Inconsistency alerts • send_brochure & send_video
• WhatsApp fallback    • Non-leaky error handling
     └──────────┬──────────┘
                ▼
        Assistant-UI View
• Markdown (raw HTML disabled)
• PdfCard (Open / Download)
• VideoCard (HTML5 + Website fallback)
• SourceChips ([Title](URL))
• Mode Badge & Error Retry Banner
```

---

## 4. How to Open the Knowledge View

The read-only Knowledge View is accessible from:
1. Nav Bar: click **Knowledge View** in the top navigation.
2. Direct URL: Navigate to [`/knowledge`](http://localhost:3000/knowledge).
3. Chat Sheet: Click the **View Sources** link in the assistant header banner.
4. Footer: Click **Knowledge View** in the footer links.

### Knowledge View Capabilities:
- **Indexed Website Sources**: Browse all 20 captured pages, word counts, and expandable ground truth text.
- **Media Registry**: Inspect registered PDFs and Videos, URLs, demo status, and availability.
- **Test Assistant Retrieval Simulator**: Type any question and execute the exact same retrieval and media selection pipeline used by `/api/chat`. Inspect the cosine scores, exact chunks passed to the model, and deterministic media chosen.

---

## 5. Known Site Inconsistencies & Honest Handling

The live Greedy Adventures website contains several conflicting statements across pages. The assistant never silently picks one:
1. **Freefall Duration**:
   - *Sea View experience page*: ~60 seconds of freefall.
   - *Skydiving overview page*: ~45 seconds of freefall.
   - *Bot response*: Surfaces both figures, states that numbers vary by page, and advises confirming on WhatsApp.
2. **Time at Dropzone**:
   - *Sea View experience page*: 3 hours.
   - *Contact FAQ*: 3 to 4 hours.
   - *Bot response*: Explains both estimates and what the extra time covers.
3. **DELUXE Package Media Description**:
   - *Package Card*: "Video and photos included".
   - *Page FAQ*: "Handy cam video".
   - *Bot response*: Notes both descriptions and confirms it is the ฿12,500 instructor-recorded media tier.

---

## 6. Verification Steps Table

| Area | Check | Expected Result | Verified |
|---|---|---|:---:|
| **Answers** | "What is included in the package?" | Text response listing the 4 inclusions + source link | Pass |
| **Follow-ups** | "Tell me about DELUXE", then "how much is it?" | Resolves DELUXE context to ฿12,500 without restating package | Pass |
| **PDF** | "Can you send me a brochure?" | Renders `PdfCard` with "Demo material" tag, Open & Download buttons | Pass |
| **Video** | "Can I see a video of the experience?" | Renders `VideoCard` with HTML5 player + "Watch on website" fallback link | Pass |
| **Both** | "Send me the brochure and a video." | Delivers both `PdfCard` and `VideoCard` in one response | Pass |
| **Missing info** | Unrelated question ("capital of France") or uncaptured FAQ ("use my own GoPro") | Returns honest "I don't have that information" message + WhatsApp fallback | Pass |
| **Missing media** | Set media item `available: false` | Bot states item is unavailable; does not invent files or links | Pass |
| **Failure** | Simulate engine or model failure | Displays `ErrorBanner` with Retry button; never leaks API keys | Pass |
| **Mode Badge** | Empty keys vs key present | Displays "Demo mode: no AI key" or "Live AI" badge | Pass |
| **Knowledge View** | Run test simulator on `/knowledge` | Returns identical chunks, media, and preview as `/api/chat` | Pass |
| **Accessibility** | Tab, Enter, Esc, ARIA | Fully keyboard-navigable; Esc closes chat; visible focus rings | Pass |
| **Automated** | `npm test` | 8 test suites, 32 automated unit/integration tests pass | Pass |

---

## 7. Open-Source & Asset Credits

- **Design System & Tokens**: Stitch project `11412627557744195813` (Deep Navy `#0B1F3A`, Sky Blue `#2E8BFF`, Sunrise Orange `#FF8A3D`, Canvas Off-White `#F7F9FC`).
- **Typography**: Plus Jakarta Sans (Google Fonts).
- **Icons**: Lucide React.
- **Components**: Tailwind CSS, Assistant-UI primitives, pdf-lib (demo brochure generation).
- **Media Assets**:
  - Video 1 (Real): `https://www.greedyadventures.com/greedy/films/sea-view-studio-hero.mp4`
  - Video 2 (Real): `https://www.greedyadventures.com/greedy/films/mount-abu-hero-hd.mp4`
  - Demo Brochure: Generated locally via `pdf-lib` into `/public/media/sea-view-skydiving-brochure.pdf`.
- **AI Assistance Disclosure**: Code authored with the assistance of Antigravity AI coding assistant, thoroughly inspected, typed, and verified with unit test suites.

