import { atomWithMutation } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";
import { atom } from "jotai";
import { RouteResponse, UserAddress } from "@skip-go/client";

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
}

export const swapExecutionStateAtom = atom<SwapExecutionState>({
  route: undefined,
  userAddresses: [],
});

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const skip = get(skipClient);
  const { route, userAddresses } = get(swapExecutionStateAtom);

  return {
    gcTime: Infinity,
    mutationFn: async () => {
      // handle checking that all chains have an address associated

      if (!route) return;

      try {
        await skip.executeRoute({
          route,
          userAddresses,
          validateGasBalance: route.sourceAssetChainID !== "984122",
          // getFallbackGasAmount: async (chainID, chainType) => {
          //   if (chainType === "cosmos") {
          //     return Number(useSettingsStore.getState().customGasAmount);
          //   }
          // },
          onTransactionTracked: async (_txStatus) => {
            // console.log(txStatus);
          },
        });
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    onMutate: () => {
      // console.log("mutated");
    },
    onError: (err: unknown) => {
      // handle errors;
      console.error(err);
    }
  };
});