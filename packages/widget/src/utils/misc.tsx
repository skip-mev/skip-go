import { atomWithStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export const withBoundProps = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  boundProps: Partial<P>,
) => {
  return (props: Partial<P>): React.ReactElement => {
    const combinedProps = {
      ...boundProps,
      ...props,
    } as P;
    return <WrappedComponent {...combinedProps} />;
  };
};

export const copyToClipboard = (string?: string) => {
  if (string) {
    navigator.clipboard.writeText(string);
  }
};

export function atomWithStorageNoCrossTabSync<T>(storageKey: string, initialValue: T) {
  const defaultStorage: SyncStorage<T> = {
    getItem: (key) => {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return initialValue;

      try {
        return JSON.parse(storedValue);
      } catch (_error) {
        return initialValue;
      }
    },
    setItem: (key, newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    removeItem: (key) => {
      localStorage.delete(key);
    },
  };

  return atomWithStorage<T>(storageKey, initialValue, defaultStorage, { getOnInit: true });
}
