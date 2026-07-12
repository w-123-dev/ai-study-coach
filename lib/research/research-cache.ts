/**
 * Research cache module.
 * Cache school/major query results in server memory to avoid
 * repeated database lookups within the same request lifecycle.
 */

/** Cache entry with TTL */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  /** TTL in milliseconds, defaults to 30 minutes */
  ttl: number;
}

/** In-memory cache store */
const cache = new Map<string, CacheEntry<any>>();

/** Default TTL: 30 minutes */
const DEFAULT_TTL = 30 * 60 * 1000;

/** Build a cache key */
function makeKey(prefix: string, ...args: string[]): string {
  return `${prefix}:${args.join(":")}`;
}

/**
 * Get a value from cache.
 */
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Set a value in cache.
 */
export function setCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

/**
 * Clear all cache entries.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Clear all entries with a given prefix.
 */
export function clearCacheByPrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/** Cache statistics */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Cache-first async lookup.
 * If a cached value exists and is not expired, return it.
 * Otherwise call the fetcher, cache the result, and return it.
 */
export async function cachedSearch<T>(
  prefix: string,
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<{ data: T; cached: boolean }> {
  const cacheKey = makeKey(prefix, key);
  const cached = getCache<T>(cacheKey);

  if (cached !== null) {
    return { data: cached, cached: true };
  }

  const data = await fetcher();
  setCache(cacheKey, data, ttl);
  return { data, cached: false };
}
