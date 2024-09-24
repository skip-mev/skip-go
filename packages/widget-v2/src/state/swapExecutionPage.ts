import { atomWithMutation } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";
import { atom } from "jotai";
import { RouteResponse, UserAddress } from "@skip-go/client";
import { MinimalWallet } from "./wallets";
import { atomEffect } from "jotai-effect";

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
}
export type ChainAddress = {
  chainID: string;
  chainType?: "evm" | "cosmos" | "svm";
  address?: string;
} & (
    | { source?: "input" | "parent" }
    | {
      source?: "wallet",
      wallet: Pick<MinimalWallet, "walletName" | "walletPrettyName" | "walletChainType" | "walletInfo">
    }
  )

/**
 * route.requiredChainAddresses is a list of chainIDs that are required to have an address associated with them
 * the key in this atom is the index of the chainID in the requiredChainAddresses array
 */
export const chainAddressesAtom = atom<Record<number, ChainAddress>>({});

export const swapExecutionStateAtom = atom<SwapExecutionState>({
  route: undefined,
  userAddresses: [],
});

export const chainAddressEffectAtom = atomEffect(
  (get, set) => {
    const chainAddresses = get(chainAddressesAtom);
    if (!Object.values(chainAddresses).every((chainAddress) => !!chainAddress.address)) return;
    const userAddresses = Object.values(chainAddresses).map((chainAddress) => {
      return {
        chainID: chainAddress.chainID,
        address: chainAddress.address as string,
      };
    });

    set(swapExecutionStateAtom, (prev) => ({
      ...prev,
      userAddresses,
    }));
  },
);

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const skip = get(skipClient);
  const { route, userAddresses } = get(swapExecutionStateAtom);

  return {
    gcTime: Infinity,
    mutationFn: async () => {
      // handle checking that all chains have an address associated

      if (!route) return;
      if (!userAddresses.length) return;

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
