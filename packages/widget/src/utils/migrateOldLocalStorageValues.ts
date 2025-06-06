/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionHistoryItem } from "@/state/history";
import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";

export const migrateOldLocalStorageValues = () => {
  if (typeof window === "undefined") return;

  Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      let newLocalStorageValue = toCamelCase(parsed);

      if (key === LOCAL_STORAGE_KEYS.transactionHistory) {
        newLocalStorageValue = newLocalStorageValue.filter(
          (txHistoryItem: TransactionHistoryItem) => {
            const chainId = txHistoryItem?.transactionDetails?.[0]?.chainId;
            const txHash = txHistoryItem?.transactionDetails?.[0]?.txHash;
            if (chainId !== undefined && txHash !== undefined) {
              return true;
            }
          },
        );
      }

      if (JSON.stringify(parsed) !== JSON.stringify(newLocalStorageValue)) {
        localStorage.setItem(key, JSON.stringify(newLocalStorageValue));
        // eslint-disable-next-line no-console
        console.info("updated old localStorage values");
      }
    } catch (err) {
      console.warn(`Failed to migrate localStorage key "${key}":`, err);
    }
  });
};

export function toCamelCase<T extends object>(obj: T) {
  return convertKeys(obj, (key) => {
    return (
      key
        // snake_case to camelCase
        .replace(/_([a-zA-Z0-9])/g, (_, letter) => letter.toUpperCase())
        // lowercase first character
        .replace(/^([A-Z])/, (match) => match.toLowerCase())
        // normalize full-uppercase acronyms like ID, API, CW → Id, Api, Cw
        .replace(/([A-Z]{2,})(?=[A-Z][a-z]|[a-z]|[0-9]|$)/g, (match) =>
          /^[A-Z]+$/.test(match) ? match.charAt(0) + match.slice(1).toLowerCase() : match,
        )
    );
  });
}

export function convertKeys<T extends object>(obj: T, convertKey: (key: string) => string): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, convertKey)) as any;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[convertKey(key)] = convertKeys((obj as any)[key], convertKey);
      return acc;
    }, {} as any);
  } else {
    return obj;
  }
}
