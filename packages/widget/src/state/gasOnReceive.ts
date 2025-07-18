import { atom } from "jotai";
import { skipChainsAtom } from "./skipClient";
import { _skipRouteAtom } from "./route";
import { ChainType } from "@skip-go/client";
import { destinationAssetAtom, sourceAssetAtom } from "./swapPage";
import { skipAllBalancesAtom } from "./balances";
import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";

const GAS_ON_RECEIVE_AMOUNT_USD = {
  [ChainType.Cosmos]: 0.5,
  [ChainType.Evm]: 10,
  evm_l2: 4,
};

export const gasOnReceiveAtom = atom<boolean>(true);
export const gasOnReceiveAmountAtom = atom<string | undefined>(undefined);

export const gasOnReceiveRouteRequestAtom = atom((get) => {
  const balances = get(skipAllBalancesAtom);
  const chains = get(skipChainsAtom);
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const _amount = get(gasOnReceiveAmountAtom);
  if (!sourceAsset || !destinationAsset) return;
  const destinationChain = chains.data?.find((c) => c.chainId === destinationAsset?.chainId);

  const amountUsd = (() => {
    if (_amount !== undefined) return parseFloat(_amount);
    if (destinationChain?.chainId === "1") {
      return GAS_ON_RECEIVE_AMOUNT_USD.evm_l2;
    }
    if (destinationChain?.chainType === ChainType.Evm) {
      return GAS_ON_RECEIVE_AMOUNT_USD[ChainType.Evm];
    }
    return GAS_ON_RECEIVE_AMOUNT_USD[ChainType.Cosmos];
  })();

  const destinationFeeAssets = destinationChain?.feeAssets.map((asset) => asset.denom);

  if (!sourceAsset?.chainId || !sourceAsset.denom || !destinationFeeAssets) return;

  const sourceAssetUsdPrice =
    balances?.data?.chains?.[sourceAsset?.chainId]?.denoms?.[sourceAsset?.denom]?.price;
  if (!sourceAssetUsdPrice) return;
  const amount = Number(sourceAssetUsdPrice) * amountUsd;

  return {
    amountIn: convertHumanReadableAmountToCryptoAmount(amount, destinationAsset?.decimals),
    sourceAssetChainId: sourceAsset.chainId,
    sourceAssetDenom: sourceAsset.denom,
    destAssetChainId: destinationAsset?.chainId,
    destAssetDenoms: destinationFeeAssets,
  };
});
