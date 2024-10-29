import { atom } from "jotai";
import { SetStateAction } from "react";

export function atomWithDebounce<T>(delayMilliseconds = 500) {
  const prevTimeoutAtom = atom<NodeJS.Timeout | undefined>(undefined);
  const _currentValueAtom = atom<T | undefined>(undefined);
  const _debouncedValueAtom = atom<T | undefined>(undefined);
  const isDebouncingAtom = atom(false);
  const valueInitialized = atom(false);

  const debouncedValueAtom = atom(
    (get) => get(_debouncedValueAtom),
    (get, set, update: SetStateAction<T>, callback?: () => void) => {
      clearTimeout(get(prevTimeoutAtom));

      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof update === "function"
          ? (update as (prev: T | undefined) => T)(prevValue)
          : update;

      // Only update if the value has changed
      if (nextValue !== prevValue) {
        set(_currentValueAtom, nextValue);
        set(isDebouncingAtom, true);
        set(valueInitialized, true);

        const timeoutId = setTimeout(() => {
          set(_debouncedValueAtom, nextValue);
          set(isDebouncingAtom, false);
          callback?.();
        }, delayMilliseconds);

        set(prevTimeoutAtom, timeoutId);
      }
    }
  );

  const cleanupAtom = atom(null, (get, set) => {
    clearTimeout(get(prevTimeoutAtom));
    set(prevTimeoutAtom, undefined);
    set(isDebouncingAtom, false);
  });

  return {
    currentValueAtom: atom((get) => get(_currentValueAtom)),
    isDebouncingAtom,
    cleanupAtom,
    debouncedValueAtom,
    valueInitialized,
  };
}