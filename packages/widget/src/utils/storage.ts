import { atomWithStorage } from "jotai/utils";
import type { AsyncStorage, SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("skip-go-widget", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("atoms");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const idbGet = async <T>(key: string): Promise<T | undefined> => {
  const db = await openDb();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction("atoms", "readonly");
    const store = tx.objectStore("atoms");
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const idbSet = async <T>(key: string, value: T): Promise<void> => {
  const db = await openDb();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction("atoms", "readwrite");
    const store = tx.objectStore("atoms");
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const idbDelete = async (key: string): Promise<void> => {
  const db = await openDb();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction("atoms", "readwrite");
    const store = tx.objectStore("atoms");
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export function atomWithIndexedDBStorage<T>(storageKey: string, initialValue: T) {
  const defaultStorage: AsyncStorage<T> = {
    getItem: async (key) => {
      const value = await idbGet<T>(key);
      return value ?? initialValue;
    },
    setItem: async (key, newValue) => {
      await idbSet(key, newValue);
    },
    removeItem: async (key) => {
      await idbDelete(key);
    },
  };

  return atomWithStorage<T>(storageKey, initialValue, defaultStorage, { getOnInit: true });
}

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
