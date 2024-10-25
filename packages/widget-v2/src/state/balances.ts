import { BalanceRequest, BalanceResponse } from "@skip-go/client";
import { atom } from "jotai";
// import { atomWithQuery } from "jotai-tanstack-query";
// import { skipClient } from "./skipClient";
// import { isInvertingSwapAtom } from "./swapPage";

export const skipAllBalancesRequestAtom = atom<BalanceRequest | undefined>();

// export const skipAllBalancesAtom = atomWithQuery((get) => {
//   const skip = get(skipClient);
//   const params = get(skipAllBalancesRequestAtom);
//   const isInvertingSwap = get(isInvertingSwapAtom);

//   const enabled = Object.values(params ?? {}).length > 0 && !isInvertingSwap;

//   return {
//     queryKey: ["skipBalances", params],
//     queryFn: async () => {
//       if (!params) {
//         throw new Error("No balance request provided");
//       }

//       return skip.balances(params);
//     },
//     enabled,
//     refetchInterval: 1000 * 60,
//     retry: 1,
//     gcTime: 0,
//   };
// });

type SkipBalances = {
  data: BalanceResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
}

export const skipAllBalancesAtom = atom<SkipBalances>({
  data: undefined,
  isLoading: false,
  isError: false,
  isFetching: false,
  refetch: () => {
    console.warn("refetch not implemented");
  },
});
