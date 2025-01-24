import { atom } from "jotai";
import { SetStateAction } from "react";

export function atomWithDebounce<T>(initialValue?: T, delayMilliseconds = 250) {
  const prevTimeoutAtom = atom<NodeJS.Timeout | undefined>(undefined);

  // DO NOT EXPORT currentValueAtom as using this atom to set state can cause
  // inconsistent state between currentValueAtom and debouncedValueAtom
  // Initialize _currentValueAtom with the initial value
  const _currentValueAtom = atom<T | undefined>(initialValue);
  const isDebouncingAtom = atom(false);
  const valueInitialized = atom(initialValue !== undefined);

  // Atom for debounced value, also initialized with initial value
  const debouncedValueAtom = atom(
    initialValue, // Set initial value here too
    (get, set, update: SetStateAction<T>, callback?: () => void, immediate?: boolean) => {
      clearTimeout(get(prevTimeoutAtom));

      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof update === "function" ? (update as (prev: T | undefined) => T)(prevValue) : update;

      const onDebounceStart = () => {
        set(_currentValueAtom, nextValue);
        set(isDebouncingAtom, true);
        set(valueInitialized, true);
      };

      const onDebounceEnd = () => {
        set(debouncedValueAtom, nextValue);
        set(isDebouncingAtom, false);
        callback?.();
      };

      if (immediate) {
        onDebounceEnd();
      } else {
        onDebounceStart();
      }

      const nextTimeoutId = setTimeout(() => {
        onDebounceEnd();
      }, delayMilliseconds);

      // set previous timeout atom in case it needs to get cleared
      if (nextTimeoutId) {
        set(prevTimeoutAtom, nextTimeoutId);
      }
    },
  );

  // Exported atom setter to clear the timeout if needed
  const clearTimeoutAtom = atom(null, (get, set, _arg) => {
    clearTimeout(get(prevTimeoutAtom));
    set(isDebouncingAtom, false);
  });

  return {
    currentValueAtom: atom((get) => get(_currentValueAtom)),
    isDebouncingAtom,
    clearTimeoutAtom,
    debouncedValueAtom,
    valueInitialized,
  };
}
