import { AnswerEngine, ChatMessage, EngineResult, SourceReference } from "./types";
import { retrieveChunks } from "@/lib/knowledge/retrieve";
import { selectMedia } from "@/lib/media/selectMedia";
import { saveTrace } from "./traceStore";

export class DemoEngine implements AnswerEngine {
  readonly mode = "demo" as const;

  async generateAnswer(messages: ChatMessage[]): Promise<EngineResult> {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const rawQuestion = lastUserMessage?.content || "";
    const question = rawQuestion.trim();

    // Carry over context from previous discussion (e.g. DELUXE, VIP, ECO, Mount Abu, Pattaya)
    let contextSummary = "";
    const prevMessages = messages.slice(0, -1);
    for (const msg of prevMessages) {
      const lower = msg.content.toLowerCase();
      if (lower.includes("deluxe")) contextSummary += " deluxe package";
      if (lower.includes("vip")) contextSummary += " vip package";
      if (lower.includes("eco")) contextSummary += " eco package";
      if (lower.includes("mount abu") || lower.includes("india")) contextSummary += " mount abu india";
      if (lower.includes("pattaya") || lower.includes("thailand")) contextSummary += " pattaya thailand";
    }

    // Run real media selection
    const mediaResult = selectMedia(question);

    // Run real retrieval
    const retrieval = retrieveChunks(question, contextSummary, 5);
    const topChunk = retrieval.chunks[0];
    const lowerQuestion = question.toLowerCase();

    const sources: SourceReference[] = retrieval.chunks.map((c) => ({
      title: c.title,
      url: c.url,
    }));

    // Deduplicate sources
    const uniqueSources: SourceReference[] = [];
    const seenUrls = new Set<string>();
    for (const s of sources) {
      if (!seenUrls.has(s.url)) {
        seenUrls.add(s.url);
        uniqueSources.push(s);
      }
    }

    let answerText = "";

    // 1. Check known collapsed accordion gaps
    const knownGapsQueries = [
      "own gopro",
      "use my own gopro",
      "best time to visit",
      "what should i wear",
      "wear",
      "can i add video later",
      "different from the more expensive packages",
    ];

    const isKnownGap = knownGapsQueries.some((gq) => lowerQuestion.includes(gq));

    // 2. Check known conflicting facts
    const isFreefallConflict =
      (lowerQuestion.includes("freefall") || lowerQuestion.includes("fall")) &&
      (lowerQuestion.includes("long") ||
        lowerQuestion.includes("duration") ||
        lowerQuestion.includes("seconds") ||
        lowerQuestion.includes("time"));

    const isDropzoneTimeConflict =
      lowerQuestion.includes("dropzone") &&
      (lowerQuestion.includes("how long") ||
        lowerQuestion.includes("time") ||
        lowerQuestion.includes("hours") ||
        lowerQuestion.includes("budget"));

    const isDeluxeConflict =
      lowerQuestion.includes("deluxe") &&
      (lowerQuestion.includes("conflict") ||
        lowerQuestion.includes("discrepancy") ||
        lowerQuestion.includes("handy cam") ||
        lowerQuestion.includes("photos"));

    if (isKnownGap) {
      answerText =
        "I don't have that specific information in the captured website sources (this answer was in a collapsed section on the live website). Please contact the team directly on WhatsApp (+91 95357 68554) for complete details.";
    } else if (isFreefallConflict) {
      answerText =
        "The website sources list differing figures for freefall duration:\n\n" +
        "• The [Sea View Skydiving — Tandem Jump over Pattaya](https://www.greedyadventures.com/experiences/sea-view-skydiving) experience page lists **around 60 seconds of freefall**.\n" +
        "• The [Falling is the easy part](https://www.greedyadventures.com/adventures/skydiving) overview page states **about 45 seconds**.\n\n" +
        "Because figures vary by page, we recommend confirming current load parameters with the dropzone crew on WhatsApp (+91 95357 68554).";
    } else if (isDropzoneTimeConflict) {
      answerText =
        "The website has slight variations regarding time at the dropzone:\n\n" +
        "• The [Sea View Skydiving](https://www.greedyadventures.com/experiences/sea-view-skydiving) experience page lists **3 hours at the dropzone**.\n" +
        "• The [Contact FAQ](https://www.greedyadventures.com/contact) page advises to **budget three to four hours** for check-in, briefing, ascent, jump, and media collection.\n\n" +
        "We recommend confirming the day's schedule with the team on WhatsApp (+91 95357 68554).";
    } else if (isDeluxeConflict) {
      answerText =
        "On the [Sea View Skydiving](https://www.greedyadventures.com/experiences/sea-view-skydiving) experience page, the package card lists DELUXE as having **'Video and photos included'**, whereas the page FAQ describes it as **'handy cam video'**. Both correspond to the ฿12,500 package covering instructor-filmed media. Please confirm exact camera rigging with the team on WhatsApp (+91 95357 68554).";
    } else if (!retrieval.hasRelevantChunks && mediaResult.requestedTypes.length === 0) {
      // Unrelated or score below threshold
      answerText =
        "I don't have that information in our website knowledge base. I can only assist with verified Greedy Adventures skydiving packages, requirements, and booking details. For any other questions, please contact our team on WhatsApp at +91 95357 68554.";
    } else if (
      // Package inclusions query
      lowerQuestion.includes("included") ||
      lowerQuestion.includes("what is included") ||
      lowerQuestion.includes("inclusion")
    ) {
      if (lowerQuestion.includes("abu") || lowerQuestion.includes("india")) {
        answerText =
          "In every Mount Abu tandem jump package, the following is included:\n\n" +
          "• Safety briefing and certified gear\n" +
          "• Tandem instructor support\n" +
          "• Aircraft ascent in GippsAero GA8 Airvan\n" +
          "• Freefall, parachute descent and soft landing\n" +
          "• First-jump certificate of completion\n\n" +
          "Operated by Skydive India at Manpur Airstrip, Abu Road.";
      } else {
        answerText =
          "Included in every Sea View Skydiving package in Pattaya:\n\n" +
          "• Tandem skydive experience in Pattaya, Thailand\n" +
          "• Safety briefing and USPA-certified tandem instructor support\n" +
          "• Aircraft ascent to 13,000 ft and ocean-view jump experience over the Gulf of Thailand\n" +
          "• Certificate of completion\n\n" +
          "All packages use the same aircraft, altitude, and instructors. Operated by Dropzone Thailand.";
      }
    } else if (
      // Specific package pricing query (ECO, DELUXE, VIP)
      lowerQuestion.includes("vip") ||
      (contextSummary.includes("vip") && (lowerQuestion.includes("how much") || lowerQuestion.includes("price") || lowerQuestion.includes("cost")))
    ) {
      answerText =
        "The **VIP Package** is **฿14,000 per person**.\n\n" +
        "It includes the tandem skydive in Pattaya from 13,000 ft, safety briefing, aircraft ascent, certificate of completion, plus a **personal cameraman and edited film**.";
    } else if (
      lowerQuestion.includes("deluxe") ||
      (contextSummary.includes("deluxe") && (lowerQuestion.includes("how much") || lowerQuestion.includes("price") || lowerQuestion.includes("cost")))
    ) {
      answerText =
        "The **DELUXE Package** is **฿12,500 per person**.\n\n" +
        "It includes the tandem skydive from 13,000 ft, safety briefing, certificate of completion, with **video and photos included**.";
    } else if (
      lowerQuestion.includes("eco") ||
      (contextSummary.includes("eco") && (lowerQuestion.includes("how much") || lowerQuestion.includes("price") || lowerQuestion.includes("cost")))
    ) {
      answerText =
        "The **ECO Package** is **฿9,500 per person**.\n\n" +
        "It is the jump, nothing else: includes the 13,000 ft tandem jump, safety briefing, ocean view, and certificate of completion. Media coverage is not included.";
    } else if (
      lowerQuestion.includes("mount abu") ||
      lowerQuestion.includes("abu road") ||
      lowerQuestion.includes("india price")
    ) {
      answerText =
        "Tandem skydiving at Mount Abu, Rajasthan (operated by Skydive India):\n\n" +
        "• **Handycam Video**: ₹29,999 per person (excluding GST)\n" +
        "• **Outside Cameraman**: ₹39,999 per person (excluding GST)\n\n" +
        "Booking requires a ₹2,000 deposit with the balance paid on jump day. Weight surcharges apply for 95–104 kg (₹3,000) and 105–113 kg (₹6,000). Maximum weight is 113 kg.";
    } else if (
      lowerQuestion.includes("cancel") ||
      lowerQuestion.includes("refund") ||
      lowerQuestion.includes("weather")
    ) {
      answerText =
        "Cancellation and weather policy summary:\n\n" +
        "• **Weather hold**: If weather stops the jump, you can wait for the next window, move dates at no cost, or receive a full refund.\n" +
        "• **Customer cancellation**: Single-day activities can be cancelled free with more than 48 hours notice. Inside 48 hours, fees may apply.\n" +
        "• **No-shows**: Not refunded.\n" +
        "• **Refund processing**: Deposits are returned within 7 working days.\n" +
        "• Travel insurance covering skydiving is strongly recommended.";
    } else if (
      lowerQuestion.includes("weight") ||
      lowerQuestion.includes("age") ||
      lowerQuestion.includes("requirement")
    ) {
      answerText =
        "Key requirements for tandem skydiving:\n\n" +
        "• **Pattaya (Thailand)**: Age 18+ with valid government photo ID. Maximum weight limit 100 kg.\n" +
        "• **Mount Abu (India)**: Minimum age 12 (ages 12–17 require parental consent). Maximum weight 113 kg (surcharges apply over 94 kg).\n" +
        "• No prior experience needed: USPA-certified instructors fly the jump.";
    } else if (topChunk) {
      // Extractive synthesis from top retrieved chunk
      const lines = topChunk.text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 15);

      const excerpt = lines.slice(0, 4).join("\n• ");
      answerText = `Based on the website sources:\n\n• ${excerpt}`;
    }

    // If media was requested, add friendly conversational preamble
    if (mediaResult.requestedTypes.length > 0) {
      const parts: string[] = [];
      if (mediaResult.pdf) parts.push("the official Sea View Skydiving experience brochure (Demo material)");
      if (mediaResult.video) parts.push("our jump video footage");

      if (parts.length > 0) {
        const mediaIntro = `I have shared ${parts.join(" and ")} below.`;
        answerText = answerText ? `${mediaIntro}\n\n${answerText}` : mediaIntro;
      }

      if (mediaResult.unavailabilityNotices.length > 0) {
        answerText += "\n\n" + mediaResult.unavailabilityNotices.join("\n");
      }
    }

    // Attach primary source citation if not already present
    if (uniqueSources.length > 0 && !answerText.includes(uniqueSources[0].url)) {
      const topSrc = uniqueSources[0];
      answerText += `\n\nSource: [${topSrc.title}](${topSrc.url})`;
    }

    const result: EngineResult = {
      text: answerText,
      sources: uniqueSources,
      media: {
        pdf: mediaResult.pdf,
        video: mediaResult.video,
      },
      mode: "demo",
      traceId,
    };

    // Save trace for knowledge test panel and debugging
    saveTrace({
      traceId,
      timestamp: new Date().toISOString(),
      question,
      mode: "demo",
      chunks: retrieval.chunks,
      mediaSelected: {
        pdf: mediaResult.pdf,
        video: mediaResult.video,
      },
      answer: answerText,
    });

    return result;
  }
}
