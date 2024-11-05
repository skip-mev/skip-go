import { atom } from "jotai";
import { SetStateAction } from "react";

export function atomWithDebounce<T>(delayMilliseconds = 500) {
  const prevTimeoutAtom = atom<NodeJS.Timeout | undefined>(
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
    (get, set, update: {
      newValue: SetStateAction<T>;
      callback?: () => void;
      immediate?: boolean;
    }) => {
      const { newValue, callback, immediate } = update;

      clearTimeout(get(prevTimeoutAtom));

      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof newValue === "function"
          ? (newValue as (prev: T | undefined) => T)(prevValue)
          : newValue;

      const onDebounceStart = () => {
        set(_currentValueAtom, nextValue);
        set(isDebouncingAtom, true);
        set(valueInitialized, true);
      };

      const onDebounceEnd = () => {
        set(debouncedValueAtom, { newValue: nextValue });
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
