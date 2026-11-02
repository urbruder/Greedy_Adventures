const ALLOWED_HOSTS = new Set([
  "www.greedyadventures.com",
  "greedyadventures.com",
]);

/**
 * Validates that a media/source URL is safe:
 * - Must be either a relative path starting with '/' (app's own origin)
 * - Or an HTTPS URL with an allow-listed host (www.greedyadventures.com)
 * Rejects javascript:, http:, data:, or any unauthorized external host.
 */
export function validateUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== "string") {
    return false;
  }

  const trimmed = urlStr.trim();

  // Allow internal relative paths (app's own origin)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

