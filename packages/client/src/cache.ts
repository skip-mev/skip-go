import { createHash } from 'crypto';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type CacheOptions = {
  cacheDurationMs: number;
};

export class CustomCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, timestamp: number) {
    this.cache.set(key, { data, timestamp });
  }

  get<T>(key: string): CacheEntry<T> | undefined {
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
  }
}
interface Cache {
  set<T>(key: string, data: T, timestamp: number): void;
  get<T>(key: string): CacheEntry<T> | undefined;
  clear(): void;
}
export const createCachingMiddleware = (cache: Cache, { cacheDurationMs }: CacheOptions) => {
  return async <T, Args extends any[]>(
    key: string,
    fn: (...args: Args) => Promise<T>,
    args: Args
  ): Promise<T> => {
    const argsHash = createHash('md5').update(JSON.stringify(args)).digest('hex');
    const cacheKey = `${key}:${argsHash}`;

    const now = Date.now();
    const cachedEntry = cache.get<T>(cacheKey);
    console.log('cacheDurationMs', cacheDurationMs)
    if (cachedEntry && now - cachedEntry.timestamp < cacheDurationMs) {
      return cachedEntry.data;
    }

    const result = await fn(...args);
    cache.set(cacheKey, result, now);
    return result;
  };
}