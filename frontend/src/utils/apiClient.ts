/**
 * Lightweight, zero-dependency in-memory API client for frontend requests.
 * Features:
 * - Request deduplication: Multiple simultaneous calls for the same URL share a single in-flight Promise.
 * - Short in-memory cache (TTL): Eliminates redundant network round-trips when components mount at the same time.
 * - Manual invalidation on data mutation.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

export async function fetchWithDeduplication<T = any>(
  url: string,
  options?: RequestInit,
  ttlMs = 4000
): Promise<T> {
  const method = options?.method?.toUpperCase() || "GET";

  // Only cache and deduplicate GET requests without custom headers/body
  if (method !== "GET") {
    const res = await fetch(url, options);
    return res.json();
  }

  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  // Deduplicate in-flight promises
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url)!;
  }

  const fetchPromise = fetch(url, options)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      cache.set(url, { data, expiry: Date.now() + ttlMs });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(url);
    });

  inFlightRequests.set(url, fetchPromise);
  return fetchPromise;
}

export function invalidateApiCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }
  cache.forEach((_, key) => {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  });
}
