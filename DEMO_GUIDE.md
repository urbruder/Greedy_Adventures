# Complete Technical & Submission Guide: Sea View Skydiving Prototype

This document is your complete walkthrough of the **Greedy Adventures Full Stack Developer Assignment (Round 1)** prototype. It explains how every part of the system works under the hood, how to verify and deploy the application, and the exact messages to send to the company before and after deployment.

---

## Table of Contents
1. [Architecture & System Flow Overview](#1-architecture--system-flow-overview)
2. [Deep Dive: How Each Component Works](#2-deep-dive-how-each-component-works)
   - [2.1 Data & Capture Pipeline (`data/`, `scripts/`)](#21-data--capture-pipeline)
   - [2.2 In-Memory BM25 Retrieval Engine (`lib/knowledge/`)](#22-in-memory-bm25-retrieval-engine)
   - [2.3 Media Registry & Intent Selector (`lib/media/`)](#23-media-registry--intent-selector)
   - [2.4 Chat Engine Abstraction (`DemoEngine` vs `LiveEngine`)](#24-chat-engine-abstraction)
   - [2.5 Security, Validation & URL Protection (`lib/validation/`, `lib/media/validateUrl.ts`)](#25-security-validation--url-protection)
   - [2.6 API Route Handlers (`app/api/`)](#26-api-route-handlers)
   - [2.7 Frontend UI & Design System (`components/ui/`, `app/page.tsx`)](#27-frontend-ui--design-system)
   - [2.8 Assistant-UI & Tool Components (`components/chat/`)](#28-assistant-ui--tool-components)
   - [2.9 Read-Only Knowledge View & Simulator (`app/knowledge/page.tsx`)](#29-read-only-knowledge-view--simulator)
3. [Handling Known Site Inconsistencies & Gaps](#3-handling-known-site-inconsistencies--gaps)
4. [Pre-Deployment Checklist (Before Deploying)](#4-pre-deployment-checklist-before-deploying)
5. [Vercel Deployment Step-by-Step](#5-vercel-deployment-step-by-step)
6. [Post-Deployment Verification (After Deploying)](#6-post-deployment-verification-after-deploying)
7. [What to Message the Company (Ready-to-Send Templates)](#7-what-to-message-the-company-ready-to-send-templates)
   - [Email 1: Clarification or Pre-Submission Check-in (Optional)](#email-1-clarification-or-pre-submission-check-in-optional)
   - [Email 2: Final Submission Email (Mandatory)](#email-2-final-submission-email-mandatory)
   - [Interview Defense / Talking Points (How to Explain Any Part)](#interview-defense--talking-points)

---

## 1. Architecture & System Flow Overview

The application is structured into four completely decoupled tiers with zero runtime database dependencies:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. CLIENT LAYER (React / Next.js)               │
│                                                                        │
│   Landing Page (Stitch Tokens)    Floating Chat Panel    Knowledge View│
│   • Hero, Packages, Plan, FAQ    • assistant-ui tools   • Source list  │
│   • Responsive & Accessible      • Media cards & chips  • Test panel   │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ JSON Payloads
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        2. API ROUTE HANDLERS                           │
│                                                                        │
│   POST /api/chat             GET /api/knowledge    POST /api/knowledge │
│   • Zod input validation     • Public sources      /test               │
│   • In-memory rate limiting  • Media registry      • Exact same RAG    │
│   • Safe error formatting    • Current mode badge    pipeline as chat  │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌────────────────────────────────┐         ┌─────────────────────────────┐
│ 3A. RETRIEVAL & MEDIA DISPATCH │         │ 3B. ANSWER ENGINE LAYER     │
│                                │         │                             │
│ • Deterministic selectMedia()  │         │ • getEngine() switcher      │
│ • BM25 Vector Retrieval        │────────►│ • DemoEngine (Default, RAG) │
│ • Stopword filtering           │         │ • LiveEngine (AI SDK / key) │
│ • Primary experience boosting  │         │ • System prompt grounding   │
└────────────────────────────────┘         └─────────────────────────────┘
                                                           │
                                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        4. STATIC GROUND TRUTH                          │
│                                                                        │
│   data/sources.json         data/media.json      public/media/         │
│   • 20 captured URLs        • PDF & Video specs  • Demo Brochure PDF   │
│   • Committed (no scraping) • Availability flags • (Generated via      │
│                                                    pdf-lib)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Deep Dive: How Each Component Works

### 2.1 Data & Capture Pipeline
- **`scripts/capture-sources.ts`**:
  - Fetches the fixed 20-URL list using Node `fetch` with realistic browser headers.
  - Strips boilerplate HTML (`script`, `style`, `nav`, `footer`, `header`, `svg`, `noscript`).
  - Scrapes headings (`h1`–`h5`), paragraphs (`p`), lists (`li`), and details.
  - Parses React Server Component flight data (`self.__next_f.push([1, "..."])`) to capture embedded Next.js SSR state.
  - Writes structured data to `data/sources.json` with the exact schema:
    ```typescript
    type Source = { id: string; title: string; url: string; capturedAt: string; text: string };
    ```
  - Outputs `data/capture-report.json` logging successful URLs (20/20), zero failed URLs, and known website gaps.
- **`scripts/generate-demo-pdf.ts`**:
  - Uses `pdf-lib` to generate `public/media/sea-view-skydiving-brochure.pdf`.
  - Embeds real package prices (ECO ฿9,500, DELUXE ฿12,500, VIP ฿14,000), inclusions, contact details, and a clear disclaimer: *"Demo material generated for this prototype; not an official Greedy Adventures document."*

### 2.2 In-Memory BM25 Retrieval Engine (`lib/knowledge/`)
- **`chunk.ts`**:
  - Divides documents into ~700-character overlapping chunks (150-character overlap) along natural paragraph boundaries.
- **`retrieve.ts`**:
  - Implements the **Okapi BM25 ranking algorithm**:
    $$\text{IDF}(t) = \ln\left(\frac{N - \text{df}(t) + 0.5}{\text{df}(t) + 0.5} + 1\right)$$
    $$\text{BM25 Score} = \sum \text{IDF}(t) \cdot \frac{\text{TF}(t, D) \cdot (k_1 + 1)}{\text{TF}(t, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgDocLength}}\right)}$$
    *(with $k_1 = 1.2$, $b = 0.75$)*
  - **Stopword Filtering**: Strips 100+ high-frequency English stopwords (`the`, `is`, `what`, `of`, `in`) to prevent false-positive matches on unrelated questions like *"what is the capital of France"*.
  - **Context-Aware Weighting**: Weighs terms in the current question higher (1.4×) than historical context terms.
  - **Primary Page Boosting**: Applies a 1.25× multiplier to chunks from the primary Sea View experience page (`experiences-sea-view-skydiving`).
  - **Relevance Threshold**: Enforces a minimum score cutoff ($2.0$). If the top score falls below the threshold, `hasRelevantChunks` is set to `false`, activating the honest *"I don't have that information"* response.

### 2.3 Media Registry & Intent Selector (`lib/media/`)
- **`registry.ts`**: Loads and manages `data/media.json`:
  - Sea View Skydiving Main Jump Film (`https://www.greedyadventures.com/greedy/films/sea-view-studio-hero.mp4`, `isDemo: false`).
  - Mount Abu Hero Film (`https://www.greedyadventures.com/greedy/films/mount-abu-hero-hd.mp4`, `isDemo: false`).
  - Sea View Skydiving Brochure (`/media/sea-view-skydiving-brochure.pdf`, `isDemo: true`).
- **`selectMedia.ts`**:
  - Deterministically inspects the query:
    - `"brochure"`, `"pdf"`, or `"pamphlet"` $\to$ PDF requested.
    - `"video"`, `"watch"`, `"film"`, or `"footage"` $\to$ Video requested.
    - Both terms present $\to$ Both requested.
    - Neither present $\to$ None requested.
  - **Availability Fallback**: If a requested item has `available: false` or is missing from the registry, it returns `{ pdf: null, video: null }` with an unavailability notice. **No media files are ever fabricated.**

### 2.4 Chat Engine Abstraction (`lib/chat/`)
- **`AnswerEngine` Interface**:
  ```typescript
  export interface AnswerEngine {
    readonly mode: "demo" | "live";
    generateAnswer(messages: ChatMessage[]): Promise<EngineResult>;
  }
  ```
- **`DemoEngine.ts` (Active by default)**:
  - Runs real BM25 retrieval and real deterministic media selection.
  - Resolves multi-turn conversation context (e.g., carrying `"deluxe"` or `"vip"` from previous turns into follow-up questions like *"how much is it?"*).
  - Handles queries about uncaptured accordions or unrelated topics by returning an honest message referring the user to WhatsApp (+91 95357 68554).
  - Explicitly surfaces known website discrepancies (such as freefall duration ~60s vs ~45s).
  - Attaches source citations (`[Page Title](URL)`).
  - Records execution telemetry in `traceStore.ts`.
- **`LiveEngine.ts` (Ready for production keys)**:
  - Integrates with the Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`).
  - Uses a grounded system prompt (`systemPrompt.ts`) strictly forbidding hallucinated prices, URLs, or files.
  - Exposes two tools: `send_brochure` and `send_video`.
  - Traps model errors safely: never leaks API keys or internal stack traces, and renders an error banner offering a one-click fallback to Demo mode.
- **`getEngine.ts`**:
  - Checks `process.env.ANTHROPIC_API_KEY`, `process.env.OPENAI_API_KEY`, and `process.env.MOCK_MODE`.
  - Returns `LiveEngine` only if an API key is present and `MOCK_MODE !== "true"`; otherwise returns `DemoEngine`.

### 2.5 Security, Validation & URL Protection
- **`lib/validation/schemas.ts`**:
  - Validates all API inputs using Zod.
  - Enforces string length limits (max 2,000 characters per chat message; max 1,000 characters per test question).
  - Restricts role types to `["user", "assistant", "system", "data"]`.
  - Rejects malformed or oversized payloads with HTTP 400.
- **`lib/media/validateUrl.ts`**:
  - Enforces strict allowlisting: allows only relative paths on the app's own origin (starting with `/`) and `https://www.greedyadventures.com` / `https://greedyadventures.com`.
  - Blocks `http:`, `javascript:`, `data:`, `vbscript:`, protocol-relative `//` URLs, and unauthorized third-party domains.
- **Markdown Safety**:
  - `react-markdown` is used without `rehype-raw`. Raw HTML injection is completely disabled.

### 2.6 API Route Handlers (`app/api/`)
- **`POST /api/chat`**:
  - Validates request body with `chatRequestSchema`.
  - Evaluates in-memory rate limiting (max 30 requests per minute per IP).
  - Calls `getEngine().generateAnswer(messages)`.
  - Returns `{ text, sources, media, mode, traceId }`.
- **`GET /api/knowledge`**:
  - Returns public sources list, media registry, and active engine mode. Never exposes secrets or chat logs.
- **`POST /api/knowledge/test`**:
  - Validates question with `testQuestionSchema`.
  - Runs the exact same `retrieveChunks` and `selectMedia` pipeline as the chat endpoint.
  - Returns matched source chunks with scores, selected media, and answer preview.

### 2.7 Frontend UI & Design System (`components/ui/`, `app/page.tsx`)
- Sourced directly from **Stitch project `11412627557744195813`**:
  - **Header Nav**: Sticky blurred header with brand badge, desktop jump links, Knowledge View link, and WhatsApp conversion button.
  - **Hero**: Deep Navy background (`#0B1F3A`), active flight zone pill (`Pacific Flight Zone • 13,000 FT AGL • Open Daily`), bold Plus Jakarta Sans typography, and real-time dropzone condition stat cards.
  - **Jump Packages Section**: Features the 3 authentic Thailand packages:
    - **ECO** (฿9,500)
    - **DELUXE** (฿12,500, Most Popular pill badge)
    - **VIP** (฿14,000)
    - Explicit notes regarding dropzone day-of-jump payment and Bangkok hotel transfer add-on.
  - **The Plan Steps**: 5-step horizontal progression representing the jump journey.
  - **FAQ Accordion**: Built using real website FAQ copy with accessible expand/collapse behavior.
  - **Footer**: Carries the required prototype disclaimer, location details, legal links, and direct WhatsApp contact.

### 2.8 Assistant-UI & Tool Components (`components/chat/`)
- **`ChatPanel.tsx`**:
  - Floating panel on desktop (`420px × 640px`), full-screen responsive drawer on mobile.
  - Full keyboard accessibility: Esc to close, Tab navigation, and focus management.
  - Real-time Mode Badge displaying current engine mode.
  - Auto-scrolling message thread with waving welcome message and suggestion chips.
- **Tool Cards**:
  - `PdfCard`: Red PDF emblem, "Demo material" badge, and separate **Open** (new tab) and **Download** triggers.
  - `VideoCard`: Responsive 16:9 HTML5 `<video controls playsInline>` player with official video badge and a verified "Watch on website" external link.
  - `SourceChip`: Clean pill under text answers displaying source page title and external link icon.
  - `NotAvailableMessage`: Contextual alert for uncaptured or unavailable questions with one-click WhatsApp chat link.
  - `TypingIndicator`: Bouncing dots alongside a skeleton media card shimmer.
  - `ErrorBanner`: High-contrast error message with a **Retry** button and option to fall back to Demo mode.
  - `SuggestionChips`: Three default prompts (*"What is included in the package?"*, *"Send me the brochure"*, *"Show me a video"*).

### 2.9 Read-Only Knowledge View & Simulator (`app/knowledge/page.tsx`)
- Located at `/knowledge` and reachable via header, footer, and chat banner.
- **Left Column**:
  - Live search filter across all 20 ingested website sources.
  - Expandable source cards showing page titles, live URLs, capture timestamps, token/word counts, and ground truth text blocks.
  - Media registry displaying PDF and video assets, demo flags, and live availability.
- **Right Column (Test Simulator)**:
  - Interactive input field with quick-fill presets.
  - Executes the real backend pipeline via `POST /api/knowledge/test`.
  - Renders:
    - **Result Block A**: Exact source chunks passed to the engine with BM25 cosine scores.
    - **Result Block B**: Media selected by the deterministic selector (PDF, Video, Both, or None).
    - **Result Block C**: Assistant answer preview.

---

## 3. Handling Known Site Inconsistencies & Gaps

The live Greedy Adventures site contains several discrepancies. The assistant handles them honestly without picking a favorite:

| Issue | Live Website Discrepancy | Prototype Handling |
|---|---|---|
| **Freefall Duration** | Sea View page says ~60s; Skydiving overview page says ~45s. | Both numbers are surfaced; notes that figures vary by page and recommends confirming on WhatsApp. |
| **Dropzone Time** | Sea View page says 3 hours; Contact FAQ says 3 to 4 hours. | Explains both estimates (3 hours core jump vs 3–4 hours including briefing and video pickup). |
| **DELUXE Media** | Package card says "video and photos included"; FAQ says "handy cam video". | Clarifies both refer to the ฿12,500 instructor-recorded media option. |
| **Collapsed Accordions** | Pattaya dropzone FAQ answers (*"can I use my own GoPro"*, *"best time to visit"*, etc.) are missing from SSR HTML. | Logged in `data/capture-report.json`. Bot states it does not have this info from the website and refers to WhatsApp. |
| **Brochure PDF** | No official brochure PDF exists on greedyadventures.com. | Generated a sample brochure in `/public/media/sea-view-skydiving-brochure.pdf` labelled *"Demo material"*. |

---

## 4. Pre-Deployment Checklist (Before Deploying)

Run these checks in your terminal to ensure everything passes locally:

```bash
# 1. Run all automated tests (must pass 32/32 tests)
npm test

# 2. Run TypeScript strict typecheck (must produce 0 errors)
npx tsc --noEmit

# 3. Run Next.js linter (must produce 0 errors)
npm run lint

# 4. Run production build test (must produce 0 errors)
npm run build
```

Verify these project conditions:
- [x] `.env.example` exists and has empty placeholders for `ANTHROPIC_API_KEY` and `OPENAI_API_KEY`.
- [x] `.env.local` is git-ignored and not committed.
- [x] `data/sources.json` is committed with all 20 captured URLs.
- [x] `public/media/sea-view-skydiving-brochure.pdf` is present and labelled *"Demo material"*.
- [x] All 8 test files in `tests/` pass cleanly.

---

## 5. Vercel Deployment Step-by-Step

Because the application requires **zero filesystem writes at runtime** and operates in Demo mode without API keys, it deploys directly to Vercel with zero environment variables configured:

1. **Push your code to GitHub / GitLab**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete greedy adventures full-stack prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/greedy-adventures-skydiving.git
   git push -u origin main
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository (`greedy-adventures-skydiving`).
   - Leave Framework Preset as **Next.js**.
   - Leave Root Directory as `./`.
   - **Environment Variables**: Leave completely blank (Demo mode will run by default).
   - Click **Deploy**.
3. **Wait ~60 seconds**: Vercel will build and assign a live production URL (e.g., `https://greedy-adventures-skydiving.vercel.app`).

---

## 6. Post-Deployment Verification (After Deploying)

Once your live Vercel URL is up, perform this quick 3-minute smoke test:

1. **Landing Page**:
   - Verify the hero section loads with the deep navy theme, altitude badge, and live condition stat cards.
   - Scroll to Packages: Confirm ECO (฿9,500), DELUXE (฿12,500), and VIP (฿14,000).
   - Check the FAQ accordion: Click a question and ensure it expands cleanly.
   - Verify the footer disclaimer: *"Demo prototype, not the official site"*.
2. **Chatbot Interface**:
   - Click the floating assistant button in the bottom right corner.
   - Verify the badge reads **"Demo mode: no AI key"**.
   - Test Question 1: Click chip *"What is included in the package?"* $\to$ Verify text list of inclusions + clickable source link.
   - Test Question 2: Click chip *"Send me the brochure"* $\to$ Verify `PdfCard` renders with Open & Download buttons.
   - Test Question 3: Click chip *"Show me a video"* $\to$ Verify `VideoCard` renders with HTML5 player + "Watch on website" link.
   - Test Question 4: Type *"Send me the brochure and a video"* $\to$ Verify both cards appear.
   - Test Question 5: Type *"Tell me about DELUXE"*, then *"how much is it?"* $\to$ Verify it carries context and answers ฿12,500.
   - Test Question 6: Type *"What is the capital of France?"* $\to$ Verify honest *"I don't have that information"* message.
3. **Knowledge View**:
   - Click **Knowledge View** in the header or visit `/knowledge`.
   - Confirm all 20 captured sources are visible with word counts and expandable text.
   - In the **Test Assistant Retrieval** panel on the right, type a question and click **Run Test Pipeline**. Confirm that matched source chunks, selected media, and answer preview appear identically to the chat endpoint.

---

## 7. What to Message the Company (Ready-to-Send Templates)

### Email 1: Clarification or Pre-Submission Check-in (Optional)
Use this only if you need to touch base before final submission (e.g., regarding model spending approval):

> **Subject**: Greedy Adventures Full Stack Developer Assignment (Round 1) — Prototype Update
>
> Hi Team,
>
> I am putting the final touches on the Sea View Skydiving full-stack prototype. 
>
> In accordance with the brief:
> 1. The prototype runs in a fully functional, labelled **Demo mode** utilizing real in-memory BM25 retrieval and deterministic media dispatch over the 20 website ground-truth sources.
> 2. `LiveEngine` is built and tested with the Vercel AI SDK, ready to connect to OpenAI or Anthropic simply by supplying an API key without any code changes.
>
> As instructed in the brief, I have avoided making any paid API calls prior to confirmation with your team. Please let me know if you would like me to configure live model credentials or proceed with the default grounded Demo engine for evaluation.
>
> I will be sharing the live Vercel link, GitHub repository, and verification notes shortly.
>
> Best regards,  
> [Your Name]

---

### Email 2: Final Submission Email (Mandatory)
Use this template to reply to the assignment invitation:

> **Subject**: Submission: Greedy Adventures Full Stack Developer Assignment (Round 1) — [Your Name]
>
> Hi Team,
>
> Thank you for the opportunity to work on the Sea View Skydiving full-stack assignment. I have completed the prototype and verified all functional and architectural requirements.
>
> ### Project Links
> - **Live Demo (Vercel)**: `https://<your-vercel-deployment-url>.vercel.app`
> - **Source Code (GitHub)**: `https://github.com/<your-username>/greedy-adventures-skydiving`
>
> ---
>
> ### Key Implementations & Highlights
>
> 1. **Stitch Design Alignment**:
>    - Aligned with Stitch project `11412627557744195813` design tokens: Deep Navy (`#0B1F3A`), Sky Blue (`#2E8BFF`), Sunrise Orange (`#FF8A3D`), Canvas Off-White (`#F7F9FC`), Plus Jakarta Sans typography, and 16–24px container radii.
>    - Responsive, keyboard-accessible landing page with sticky navigation, live condition stats, the 3 real Thailand jump packages (ECO ฿9,500, DELUXE ฿12,500, VIP ฿14,000), 5-step jump day plan, and dropzone FAQ accordion.
>
> 2. **Chatbot Architecture & assistant-ui Integration**:
>    - Built with `@assistant-ui/react` and an external store runtime.
>    - Features custom tool renderers: `PdfCard` (with Open/Download buttons), `VideoCard` (HTML5 player with a verified "Watch on website" fallback), `SourceChip` under answers, typing indicators with media skeletons, and an accessible retry banner.
>    - Dual engine abstraction (`lib/chat/`):
>      - **`DemoEngine` (Default)**: Out-of-the-box mode requiring zero API keys. Executes real BM25 retrieval, deterministic media intent detection, multi-turn follow-up resolution, and extractive grounding.
>      - **`LiveEngine`**: Vercel AI SDK integration with tool-calling (`send_brochure`, `send_video`) and safe, non-leaky error handling.
>
> 3. **Read-Only Knowledge View (`/knowledge`)**:
>    - Directly reachable from the navigation, footer, and chat header.
>    - Displays all 20 captured website sources with text viewers and the media registry.
>    - Includes an interactive **Test Retrieval Simulator** executing the identical pipeline as `/api/chat` to expose matched chunks, BM25 scores, and media selection.
>
> 4. **Handling of Known Site Gaps & Inconsistencies**:
>    - **Honest Gaps**: Collapsed accordion answers on the Pattaya dropzone escape page were missing from the SSR HTML. The bot honestly states this information is unavailable on the site and provides the direct WhatsApp number (+91 95357 68554).
>    - **Inconsistencies**: Where pages disagree (e.g., freefall duration ~60s vs ~45s; dropzone time 3h vs 3–4h), the assistant surfaces both figures and suggests confirming with the team.
>    - **Demo Brochure**: Because no PDF existed on the live site, a sample brochure was created using `pdf-lib` and labelled *"Demo material"*.
>
> 5. **Quality & Verification**:
>    - **Automated Tests**: 8 test suites, 32 unit and integration tests passing (`npm test`).
>    - **Type Safety & Linting**: 100% clean passes on `npx tsc --noEmit` and `npm run lint`.
>    - **Zero-Config Deployment**: Runs on Vercel without requiring any environment variables.
>
> A detailed verification table and architecture guide can be found in `README.md` and `DEMO_GUIDE.md` in the repository.
>
> I look forward to discussing the architecture with you!
>
> Best regards,  
> [Your Name]  
> [Your Phone / LinkedIn / Portfolio]

---

### Interview Defense / Talking Points (How to Explain Any Part)

When walking through your code in an interview, keep these crisp answers ready:

1. **"Why BM25 instead of OpenAI embeddings?"**
   - *"The brief specified that no API key is provided and no database should be required. BM25 is the industry standard for lightweight, deterministic in-memory lexical retrieval. It requires zero network hops, costs $0, avoids cold-start vector database latencies, and is completely reproducible across test runs."*

2. **"How does media selection work?"**
   - *"Media selection is decoupled and deterministic via `selectMedia(query)`. If the query contains brochure keywords, the PDF is selected; if it contains video keywords, the video is selected; if both, both are returned. If a media item is marked unavailable, the system refuses to invent files. The `/api/knowledge/test` endpoint and `/api/chat` run this exact same function."*

3. **"How do follow-ups work without an AI model in Demo Mode?"**
   - *"In `DemoEngine`, we inspect previous messages in the conversation thread. If an earlier turn discussed the DELUXE package and the user simply asks 'how much is it?', the engine carries the package context into the query so BM25 pulls the ฿12,500 pricing chunk."*

4. **"How do you handle security and malicious input?"**
   - *"All incoming requests are strictly validated using Zod with payload caps. Markdown rendering disables raw HTML to prevent XSS. All URLs rendered in links, videos, and PDFs must pass `validateUrl`, which only permits relative origin paths and https://www.greedyadventures.com."*

