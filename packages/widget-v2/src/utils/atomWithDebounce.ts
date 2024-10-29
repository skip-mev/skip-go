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
      const prevTimeout = get(prevTimeoutAtom);
      if (prevTimeout) {
        clearTimeout(prevTimeout);
      }

      // Calculate next value
      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof update === "function"
          ? (update as (prev: T | undefined) => T)(prevValue)
          : update;

      // Update current value immediately
      set(_currentValueAtom, nextValue);
      set(isDebouncingAtom, true);
      set(valueInitialized, true);

      // Debounce the update to the debounced value
      const timeoutId = setTimeout(() => {
        set(_debouncedValueAtom, nextValue);
        set(isDebouncingAtom, false);
        callback?.();
      }, delayMilliseconds);

      set(prevTimeoutAtom, timeoutId);
    }
  );

  // Cleanup atom
  const cleanupAtom = atom(null, (get, set) => {
    const prevTimeout = get(prevTimeoutAtom);
    if (prevTimeout) {
      clearTimeout(prevTimeout);
    }
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
