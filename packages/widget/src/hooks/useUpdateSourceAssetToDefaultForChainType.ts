import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { ChainType } from "@skip-go/client";
import { useAtomValue, useSetAtom } from "jotai";

export const useUpdateSourceAssetToDefaultForChainType = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);

  return (chainType: ChainType) => {
    switch (chainType) {
      case ChainType.Cosmos: {
        const chain = chains?.find((x) => x.chainId === "cosmoshub-4");
        const asset = assets?.find((x) => x.denom === "uatom");

        setSourceAsset({
          chainId: chain?.chainId,
          chainName: chain?.chainName,
          ...asset,
        });
        return;
      }
      case ChainType.Evm: {
        const chain = chains?.find((chain) => chain.chainId === "1");
        const asset = assets?.find((asset) => asset.denom === "ethereum-native");

        setSourceAsset({
          chainId: chain?.chainId,
          chainName: chain?.chainName,
          ...asset,
        });
        return;
      }
      case ChainType.Svm: {
        const chain = chains?.find((x) => x.chainId === "solana");
        const asset = assets?.find(
          (x) =>
            x.denom.toLowerCase() === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
        );

        setSourceAsset({
          chainId: chain?.chainId,
          chainName: chain?.chainName,
          ...asset,
        });
      }
    }
  };
};
