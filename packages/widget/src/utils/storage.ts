import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";
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

type IndexedDBStorageOptions = {
  dbName: string;
  storeName: string;
};

type CachedData<T> = {
  data: T;
  timestamp: number;
};

async function getIndexedDB(dbName: string, storeName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const checkRequest = indexedDB.open(dbName);

    checkRequest.onerror = () => reject(checkRequest.error);
    checkRequest.onsuccess = () => {
      const existingDb = checkRequest.result;
      const existingStores = Array.from(existingDb.objectStoreNames);

      if (existingStores.includes(storeName)) {
        resolve(existingDb);
        return;
      }

      existingDb.close();

      const currentVersion = existingDb.version;
      const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);

      upgradeRequest.onerror = () => reject(upgradeRequest.error);
      upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);

      upgradeRequest.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "key" });
        }
      };
    };

    checkRequest.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" });
      }
    };
  });
}

export async function getIndexedDBItem<T>(
  key: string,
  options: IndexedDBStorageOptions,
): Promise<T | null> {
  try {
    const dbName = options.dbName;
    const storeName = options.storeName;

    const db = await getIndexedDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CachedData<T> | undefined;
        if (!result) {
          resolve(null);
          return;
        }

        resolve(result.data);
      };
    });
  } catch (error) {
    console.warn("IndexedDB getItem failed:", error);
    return null;
  }
}

export async function setIndexedDBItem<T>(
  key: string,
  value: T,
  options: IndexedDBStorageOptions,
): Promise<void> {
  try {
    const dbName = options.dbName;
    const storeName = options.storeName;

    const db = await getIndexedDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      const cachedData: CachedData<T> = {
        data: value,
        timestamp: Date.now(),
      };

      const request = store.put({ key, ...cachedData });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn("IndexedDB setItem failed:", error);
  }
}

export async function removeIndexedDBItem(
  key: string,
  options: IndexedDBStorageOptions,
): Promise<void> {
  try {
    const dbName = options.dbName;
    const storeName = options.storeName;

    const db = await getIndexedDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn("IndexedDB removeItem failed:", error);
  }
}

export async function clearIndexedDB(options: IndexedDBStorageOptions): Promise<void> {
  try {
    const dbName = options.dbName;
    const storeName = options.storeName;

    const db = await getIndexedDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn("IndexedDB clear failed:", error);
  }
}

export function createIndexedDBStorage(options: IndexedDBStorageOptions) {
  return {
    getItem: <T>(key: string) => getIndexedDBItem<T>(key, options),
    setItem: <T>(key: string, value: T) => setIndexedDBItem(key, value, options),
    removeItem: (key: string) => removeIndexedDBItem(key, options),
    clear: () => clearIndexedDB(options),
  };
}
