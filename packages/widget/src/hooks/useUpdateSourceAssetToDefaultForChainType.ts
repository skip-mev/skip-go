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
        const chain = chains?.find((x) => x.chainID === "cosmoshub-4");
        const asset = assets?.find((x) => x.denom === "uatom");

        setSourceAsset({
          chainID: chain?.chainID,
          chainName: chain?.chainName,
          ...asset,
        });
        return;
      }
      case ChainType.EVM: {
        const chain = chains?.find((chain) => chain.chainID === "1");
        const asset = assets?.find((asset) => asset.denom === "ethereum-native");

        setSourceAsset({
          chainID: chain?.chainID,
          chainName: chain?.chainName,
          ...asset,
        });
        return;
      }
      case ChainType.SVM: {
        const chain = chains?.find((x) => x.chainID === "solana");
        const asset = assets?.find(
          (x) =>
            x.denom.toLowerCase() === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
        );

        setSourceAsset({
          chainID: chain?.chainID,
          chainName: chain?.chainName,
          ...asset,
        });
      }
    }
  };
};
