import { atomWithStorage } from "jotai/utils";
import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export function atomWithStorageNoCrossTabSync<T>(storageKey: string, initialValue: T) {
  const defaultStorage: SyncStorage<T> = {
    getItem: (key) => {
      if (typeof window === "undefined") return;
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return initialValue;

      try {
        return JSON.parse(storedValue);
      } catch (_error) {
        return initialValue;
      }
    },
    setItem: (key, newValue) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    removeItem: (key) => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    },
  };

  return atomWithStorage<T>(storageKey, initialValue, defaultStorage, { getOnInit: true });
}
