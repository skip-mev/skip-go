import { BalanceRequest, BalanceResponse } from "@skip-go/client";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";
import { isInvertingSwapAtom } from "./swapPage";

import { atom, SetStateAction } from "jotai";

// making this internal because useWithDebounce is conflicting with the original atomWithDebounce in utils
function atomWithDebounce<T>(
  initialValue: T,
  delayMilliseconds = 500,
  shouldDebounceOnReset = false,
) {
  const prevTimeoutAtom = atom<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // DO NOT EXPORT currentValueAtom as using this atom to set state can cause
  // inconsistent state between currentValueAtom and debouncedValueAtom
  const _currentValueAtom = atom(initialValue);
  const isDebouncingAtom = atom(false);

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
    },
  );

  // exported atom setter to clear timeout if needed
  const clearTimeoutAtom = atom(null, (get, set, _arg) => {
    clearTimeout(get(prevTimeoutAtom));
    set(isDebouncingAtom, false);
  });

  return {
    currentValueAtom: atom((get) => get(_currentValueAtom)),
    isDebouncingAtom,
    clearTimeoutAtom,
    debouncedValueAtom,
  };
}

export const skipAllBalancesRequestAtom = atomWithDebounce<BalanceRequest | undefined>(undefined);

export const skipAllBalancesAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipAllBalancesRequestAtom.debouncedValueAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);

  const enabled = Object.values(params ?? {}).length > 0 && !isInvertingSwap;

  return {
    queryKey: ["skipBalances", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No balance request provided");
      }

      return skip.balances(params);
    },
    enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
    gcTime: 0,
    placeholderData: (previousData: BalanceResponse | undefined) => previousData
  };
});
