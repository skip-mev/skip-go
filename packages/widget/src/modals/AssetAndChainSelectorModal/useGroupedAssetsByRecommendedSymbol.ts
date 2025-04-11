import { ClientAsset } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useMemo } from "react";
import { GroupedAsset } from "./AssetAndChainSelectorModal";
import { skipAssetsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { filterAtom, filterOutAtom, filterOutUnlessUserHasBalanceAtom } from "@/state/filters";

export type useGroupedAssetByRecommendedSymbolProps = {
  context: "source" | "destination";
};

export const useGroupedAssetByRecommendedSymbol = ({
  context,
}: useGroupedAssetByRecommendedSymbolProps) => {
  const { data: _assets } = useAtomValue(skipAssetsAtom);
  const getBalance = useGetBalance();
  const filter = useAtomValue(filterAtom);
  const filterOut = useAtomValue(filterOutAtom);
  const filterOutUnlessUserHasBalance = useAtomValue(filterOutUnlessUserHasBalanceAtom);

  const assets = useMemo(() => {
    const allowed = filter?.[context];
    const blocked = filterOut?.[context];
    const blockedUnlessUserHasBalance = filterOutUnlessUserHasBalance?.[context];

    return _assets?.filter((asset) => {
      const isAllowed =
        !allowed ||
        Object.entries(allowed).some(([chainId, denoms]) => {
          if (denoms) {
            return (
              chainId === asset.chainID &&
              denoms.map((x) => x.toLowerCase()).includes(asset.denom.toLowerCase())
            );
          } else {
            return chainId === asset.chainID;
          }
        });

      const isBlocked =
        !!blocked &&
        Object.entries(blocked).some(([chainId, denoms]) => {
          if (denoms) {
            return (
              chainId === asset.chainID &&
              denoms.map((x) => x.toLowerCase()).includes(asset.denom.toLowerCase())
            );
          } else {
            return chainId === asset.chainID;
          }
        });

      const hasBalance = getBalance(asset.chainID, asset.denom) !== undefined;

      const isBlockedUnlessUserHasBalance =
        !!blockedUnlessUserHasBalance &&
        !hasBalance &&
        Object.entries(blockedUnlessUserHasBalance).some(([chainId, denoms]) => {
          if (denoms) {
            return (
              chainId === asset.chainID &&
              denoms.map((x) => x.toLowerCase()).includes(asset.denom.toLowerCase())
            );
          } else {
            return chainId === asset.chainID;
          }
        });

      return isAllowed && !isBlocked && !isBlockedUnlessUserHasBalance;
    });
  }, [filter, context, filterOut, filterOutUnlessUserHasBalance, _assets, getBalance]);

  const groupedAssetsByRecommendedSymbol = useMemo(() => {
    if (!assets) return;
    const groupedAssets: GroupedAsset[] = [];

    const calculateBalanceSummary = (assets: ClientAsset[]) => {
      return assets.reduce(
        (accumulator, asset) => {
          const balance = getBalance(asset.chainID, asset.denom);
          if (balance) {
            accumulator.totalAmount += Number(
              convertTokenAmountToHumanReadableAmount(balance.amount, balance.decimals),
            );
            if (Number(balance.valueUSD)) {
              accumulator.totalUsd += Number(balance.valueUSD);
            }
          }
          return accumulator;
        },
        { totalAmount: 0, totalUsd: 0 },
      );
    };

    assets.forEach((asset) => {
      const foundGroup = groupedAssets.find((group) => group.id === asset.recommendedSymbol);
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
          name: asset.name,
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
