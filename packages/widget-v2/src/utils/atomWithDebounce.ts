import { atom } from "jotai";
import { SetStateAction } from "react";

export function atomWithDebounce<T>(delayMilliseconds?: number) {
  const prevTimeoutAtom = atom<number | undefined>(
    undefined
  );

  // DO NOT EXPORT currentValueAtom as using this atom to set state can cause
  // inconsistent state between currentValueAtom and debouncedValueAtom
  const _currentValueAtom = atom<T>();
  const isDebouncingAtom = atom(false);
  const valueInitialized = atom(false);

  // Atom for debounced value
  const debouncedValueAtom = atom(
    undefined,
    (get, set, update: SetStateAction<T>) => {
      clearTimeout(get(prevTimeoutAtom));

      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof update === "function"
          ? (update as (prev: T | undefined) => T)(prevValue)
          : update;

      const onDebounceStart = () => {
        set(_currentValueAtom, nextValue);
        set(isDebouncingAtom, true);
        set(valueInitialized, true);
      };

      const onDebounceEnd = () => {
        set(debouncedValueAtom, nextValue);
        set(isDebouncingAtom, false);
      };

      onDebounceStart();

      const nextTimeoutId = setTimeout(() => {
        onDebounceEnd();
      }, delayMilliseconds);

      // set previous timeout atom in case it needs to get cleared
      if (nextTimeoutId) {
        set(prevTimeoutAtom, nextTimeoutId);
      }
    }
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
