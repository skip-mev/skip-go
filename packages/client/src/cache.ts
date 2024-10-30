import { createHash } from 'crypto';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type CacheOptions = {
  cacheDurationMs: number;
};

export class CustomCache {
  private static instance: CustomCache;
  private cache: Map<string, CacheEntry<any>> = new Map();

  public static getInstance(): CustomCache {
    if (!CustomCache.instance) {
      CustomCache.instance = new CustomCache();
    }
    return CustomCache.instance;
  }

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

export const createCachingMiddleware = (cache: CustomCache, { cacheDurationMs }: CacheOptions) => {
  return async <T, Args extends any[]>(
    key: string,
    fn: (...args: Args) => Promise<T>,
    args: Args
  ): Promise<T> => {
    const argsHash = createHash('md5').update(JSON.stringify(args)).digest('hex');
    const cacheKey = `${key}:${argsHash}`;

    const now = Date.now();
    const cachedEntry = cache.get<T>(cacheKey);

    if (cachedEntry && now - cachedEntry.timestamp < cacheDurationMs) {
      return cachedEntry.data;
    }

    const result = await fn(...args);
    cache.set(cacheKey, result, now);
    return result;
  };
}