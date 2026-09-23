/** In-memory rate limit (best-effort on Fluid Compute — not a hard guarantee). */
const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

export function isHoneypotFilled(value: unknown): boolean {
  return String(value ?? "").trim().length > 0;
}

export function isLeadRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}
