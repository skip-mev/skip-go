import { atomWithMutation } from "jotai-tanstack-query";
import { skipClient, skipRouteAtom } from "./skipClient";
import { walletsAtom } from "./wallets";

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const skip = get(skipClient);
  const { data: route } = get(skipRouteAtom);
  const wallets = get(walletsAtom);
  // console.log(wallets);

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
          getFallbackGasAmount: async (chainID, chainType) => {
            if (chainType === "cosmos") {
              return Number(useSettingsStore.getState().customGasAmount);
            }
          },
          slippageTolerancePercent: useSettingsStore.getState().slippage,
          onTransactionTracked: async (txStatus) => {
            txHistory.addStatus(historyId, route, {
              chainId: txStatus.chainID,
              txHash: txStatus.txHash,
              explorerLink: txStatus.explorerLink,
            });

            setBroadcastedTxs((v) => {
              const txs = [
                ...v,
                {
                  chainID: txStatus.chainID,
                  txHash: txStatus.txHash,
                  explorerLink: txStatus.explorerLink,
                },
              ];
              return txs;
            });
          },
        });
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    onMutate: () => {

    },
    onError: (err: unknown) => {
      // handle errors;
      console.error(err);
    }
  };
});