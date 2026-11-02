import { loadSources } from "./loadSources";
import { chunkAllSources } from "./chunk";
import { Chunk, RetrievalResult } from "./types";

let cachedChunks: Chunk[] | null = null;
let avgChunkLength = 0;
let docFrequency: Map<string, number> = new Map();

const STOPWORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);

function tokenize(text: string, filterStopwords = false): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9฿₹\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 || w === "฿" || w === "₹");

  if (filterStopwords) {
    return tokens.filter((t) => !STOPWORDS.has(t));
  }
  return tokens;
}

function initializeIndex() {
  if (cachedChunks) return;

  const sources = loadSources();
  cachedChunks = chunkAllSources(sources);

  let totalLen = 0;
  docFrequency = new Map();

  for (const chunk of cachedChunks) {
    const tokens = tokenize(chunk.text + " " + chunk.title, true);
    totalLen += tokens.length;
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((t) => {
      docFrequency.set(t, (docFrequency.get(t) || 0) + 1);
    });
  }

  avgChunkLength = totalLen / Math.max(1, cachedChunks.length);
}

const K1 = 1.2;
const B = 0.75;
const RELEVANCE_THRESHOLD = 2.0;

export function retrieveChunks(
  query: string,
  recentContext = "",
  topK = 5
): RetrievalResult {
  initializeIndex();
  const chunks = cachedChunks || [];

  const combinedQuery = recentContext ? `${recentContext} ${query}` : query;

  const queryTokens = tokenize(combinedQuery, true);
  const primaryQueryTokens = tokenize(query, true);

  if (queryTokens.length === 0) {
    return {
      chunks: [],
      bestScore: 0,
      hasRelevantChunks: false,
      query,
    };
  }

  const numDocs = chunks.length;
  const scoredChunks: { chunk: Chunk; score: number }[] = [];

  for (const chunk of chunks) {
    const chunkTokens = tokenize(chunk.text + " " + chunk.title, true);
    const chunkLen = chunkTokens.length;

    const tfMap = new Map<string, number>();
    for (const t of chunkTokens) {
      tfMap.set(t, (tfMap.get(t) || 0) + 1);
    }

    let score = 0;

    for (const token of queryTokens) {
      const tf = tfMap.get(token) || 0;
      if (tf > 0) {
        const df = docFrequency.get(token) || 1;
        const idf = Math.log((numDocs - df + 0.5) / (df + 0.5) + 1);
        const tfNorm =
          (tf * (K1 + 1)) /
          (tf + K1 * (1 - B + B * (chunkLen / (avgChunkLength || 1))));

        let termScore = idf * tfNorm;
        if (primaryQueryTokens.includes(token)) {
          termScore *= 1.4;
        }
        score += termScore;
      }
    }

    // Exact string bonus for key phrases
    const lowerText = chunk.text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.length > 5 && lowerText.includes(lowerQuery)) {
      score += 4.0;
    }

    // Boost primary Sea View page slightly per section 5.6
    if (chunk.sourceId === "experiences-sea-view-skydiving") {
      score *= 1.25;
    }

    if (score > 0) {
      scoredChunks.push({
        chunk: { ...chunk, score: Math.round(score * 100) / 100 },
        score,
      });
    }
  }

  scoredChunks.sort((a, b) => b.score - a.score);

  const bestScore = scoredChunks.length > 0 ? scoredChunks[0].score : 0;
  const topChunks = scoredChunks.slice(0, topK).map((sc) => sc.chunk);

  const hasRelevantChunks = bestScore >= RELEVANCE_THRESHOLD;

  return {
    chunks: topChunks,
    bestScore: Math.round(bestScore * 100) / 100,
    hasRelevantChunks,
    query,
  };
}
