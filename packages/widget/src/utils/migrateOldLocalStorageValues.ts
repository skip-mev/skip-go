import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";
import { toCamel } from "@skip-go/client";

export const migrateOldLocalStorageValues = () => {
  if (typeof window === "undefined") return;

  Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const camelCased = toCamel(parsed);

      if (JSON.stringify(parsed) !== JSON.stringify(camelCased)) {
        localStorage.setItem(key, JSON.stringify(camelCased));
        // eslint-disable-next-line no-console
        console.info("migrated old localStorage values");
      }
    } catch (err) {
      console.warn(`Failed to migrate localStorage key "${key}":`, err);
    }
  });
};