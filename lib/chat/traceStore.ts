import { TraceRecord } from "./types";

const MAX_TRACES = 50;
const traces = new Map<string, TraceRecord>();

export function saveTrace(trace: TraceRecord) {
  if (traces.size >= MAX_TRACES) {
    const oldestKey = traces.keys().next().value;
    if (oldestKey) {
      traces.delete(oldestKey);
    }
  }
  traces.set(trace.traceId, trace);
}

export function getTrace(traceId: string): TraceRecord | undefined {
  return traces.get(traceId);
}

export function getLatestTrace(): TraceRecord | undefined {
  const all = Array.from(traces.values());
  return all[all.length - 1];
}

export function clearTracesForTesting() {
  traces.clear();
}

