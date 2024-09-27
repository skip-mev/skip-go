import { atom } from "jotai";
import { SetStateAction } from "react";

export function atomWithDebounce<T>({
  initialValue,
  delayMilliseconds = 500,
  shouldDebounceOnReset = false,
}: {
  initialValue: T;
  delayMilliseconds?: number;
  shouldDebounceOnReset?: boolean;
}) {
  const prevTimeoutAtom = atom<ReturnType<typeof setTimeout> | undefined>(undefined);

  // DO NOT EXPORT currentValueAtom as using this atom to set state can cause
  // inconsistent state between currentValueAtom and debouncedValueAtom
  const _currentValueAtom = atom(initialValue);
  const isDebouncingAtom = atom(false);

  // Atom for debounced value
  const debouncedValueAtom = atom(
    initialValue,
    (get, set, update: SetStateAction<T>) => {
      clearTimeout(get(prevTimeoutAtom));

      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof update === "function"
          ? (update as (prev: T) => T)(prevValue)
          : update;

      const onDebounceStart = () => {
        set(_currentValueAtom, nextValue);
        set(isDebouncingAtom, true);
      };

      const onDebounceEnd = () => {
        set(debouncedValueAtom, nextValue);
        set(isDebouncingAtom, false);
      };

      onDebounceStart();

      if (!shouldDebounceOnReset && nextValue === initialValue) {
        onDebounceEnd();
        return;
      }

      const nextTimeoutId = setTimeout(() => {
        onDebounceEnd();
      }, delayMilliseconds);

      // set previous timeout atom in case it needs to get cleared
      set(prevTimeoutAtom, nextTimeoutId);
    }
  );

  // Atom to instantly update the debounced value, bypassing debounce delay
  const instantUpdateAtom = atom(null, (get, set, update: SetStateAction<T>) => {
    clearTimeout(get(prevTimeoutAtom)); // Clear any pending timeout
    const prevValue = get(_currentValueAtom);
    const nextValue =
      typeof update === "function"
        ? (update as (prev: T) => T)(prevValue)
        : update;

    // Update both current and debounced values immediately
    set(_currentValueAtom, nextValue);
    set(debouncedValueAtom, nextValue);
    set(isDebouncingAtom, false); // Ensure debouncing state is false
  });

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
    instantUpdateAtom,
  };
}
