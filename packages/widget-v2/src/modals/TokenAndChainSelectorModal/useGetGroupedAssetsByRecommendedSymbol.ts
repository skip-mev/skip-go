import { ClientAsset } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useMemo } from "react";
import { GroupedAsset } from "./TokenAndChainSelectorModal";
import { skipAssetsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { chainFilterAtom } from "@/state/swapPage";

export type useGetGroupedAssetByRecommendedSymbolProps = {
  context: "source" | "destination";
}

export const useGetGroupedAssetByRecommendedSymbol = ({ context }: useGetGroupedAssetByRecommendedSymbolProps) => {
  const { data: _assets } = useAtomValue(skipAssetsAtom);
  const getBalance = useGetBalance();
  const chainFilter = useAtomValue(chainFilterAtom);

  const assets = useMemo(() => {
    if (!chainFilter || !chainFilter[context]) return _assets;
    const chainIdAndDenomsAllowed = Object.entries(chainFilter[context]);
    if (chainIdAndDenomsAllowed) {
      return _assets?.filter(asset => chainIdAndDenomsAllowed.some(entries => {
        const [chainId, denoms] = entries;
        if (denoms) {
          return denoms.includes(asset.denom) && chainId === asset.chainID;
        } else if (chainId) {
          return chainId === asset.chainID;
        }
      }));
    }
    return _assets;
  }, [_assets, chainFilter, context]);

  const groupedAssetsByRecommendedSymbol = useMemo(() => {
    if (!assets) return;
    const groupedAssets: GroupedAsset[] = [];

    const calculateBalanceSummary = (assets: ClientAsset[]) => {
      return assets.reduce(
        (accumulator, asset) => {
          const balance = getBalance(asset.chainID, asset.denom);
          if (balance) {
            accumulator.totalAmount += Number(
              convertTokenAmountToHumanReadableAmount(
                balance.amount,
                balance.decimals
              )
            );
            if (Number(balance.valueUSD)) {
              accumulator.totalUsd += Number(balance.valueUSD);
            }
          }
          return accumulator;
        },
        { totalAmount: 0, totalUsd: 0 }
      );
    };

    assets.forEach((asset) => {
      const foundGroup = groupedAssets.find(
        (group) => group.id === asset.recommendedSymbol
      );
      if (foundGroup) {
        foundGroup.assets.push(asset);
        foundGroup.chains.push({
          chainID: asset.chainID,
          chainName: asset.chainName,
          originChainID: asset.originChainID,
        });
      } else {
        groupedAssets.push({
          id: asset.recommendedSymbol || asset.symbol || asset.denom,
          chains: [
            {
              chainID: asset.chainID,
              chainName: asset.chainName,
              originChainID: asset.originChainID,
            },
          ],
          assets: [asset],
          totalAmount: 0,
          totalUsd: 0,
        });
      }
    });

    groupedAssets.forEach((group) => {
      const balanceSummary = calculateBalanceSummary(group.assets);
      group.totalAmount = balanceSummary.totalAmount;
      group.totalUsd = balanceSummary.totalUsd;
    });

    return groupedAssets;
  }, [assets, getBalance]);

  return groupedAssetsByRecommendedSymbol;
};