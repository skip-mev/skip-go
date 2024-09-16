import {
  ClientAsset,
  skipAssetsAtom,
  skipChainsAtom,
} from "@/state/skipClient";
import { getFormattedAssetAmount } from "@/utils/crypto";
import { formatUSD } from "@/utils/intl";
import { useUsdValue } from "@/utils/useUsdValue";
import { Chain } from "@skip-go/client";
import { useAtom } from "jotai";
import { useMemo } from "react";

export type AssetDetails = {
  asset?: ClientAsset;
  chain?: Chain;
  symbol?: string;
  assetImage?: string;
  chainName?: string;
  chainImage?: string;
  formattedAmount?: string;
  formattedUsdAmount?: string;
  usdAmount?: number;
};

/**
 * @param {string} [params.assetDenom] - The denomination of the asset to retrieve details for
 * @param {string} [params.amount] - The decimal/human-readable amount amount of the asset
 * @param {string} [params.tokenAmount] - The token/raw amount of the asset
 * @param {string} [params.amountUsd] - The total value of the asset in usd, used for formatting
 * @param {string} [params.chainId] - The id of the chain associated with the asset
 *
 * @returns {AssetDetails} An object containing the following properties:
 * - `asset` The asset object corresponding to the provided denomination
 * - `chain` The chain object associated with the provided chain id
 * - `symbol` The symbol of the asset, derived from the asset object
 * - `assetImage` The asset image url derived from the asset object
 * - `chainName` The name of the chain, derived from the chain object
 * - `chainImage` The chain image url, derived from the chain object
 * - `formattedAmount` The formatted amount of the asset, if the amount is provided
 * - `formattedUsdAmount` The formatted usd amount of the asset, if the amountUsd is provided
 */
export const useGetAssetDetails = ({
  assetDenom,
  amount,
  tokenAmount,
  amountUsd,
  chainId,
}: {
  assetDenom?: string;
  amount?: string;
  tokenAmount?: string;
  amountUsd?: string;
  chainId?: string;
}): AssetDetails => {
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);

  const asset = assets?.find((asset) => {
    if (chainId) {
      return asset.denom === assetDenom && asset.chainID === chainId;
    }
    return asset.denom === assetDenom;
  });
  const { data: usdValue } = useUsdValue({
    ...asset,
    value: tokenAmount
      ? getFormattedAssetAmount(tokenAmount, asset?.decimals)
      : amount,
  });
  const assetImage = asset?.logoURI;
  const symbol = asset?.recommendedSymbol ?? asset?.symbol;

  const chain = chains?.find((chain) => {
    if (chainId) {
      return chain.chainID === chainId;
    }
    return chain.chainID === asset?.chainID;
  });
  const chainName = chain?.prettyName ?? chain?.chainName;
  const chainImage = chain?.logoURI;

  const formattedAmount = amount
    ? getFormattedAssetAmount(amount, asset?.decimals)
    : undefined;

  const usdAmount = useMemo(() => {
    if (amountUsd) {
      return Number(amountUsd);
    }
    if (usdValue) {
      return usdValue;
    }
    return;
  }, [amountUsd, usdValue]);

  const formattedUsdAmount = useMemo(() => {
    if (usdAmount) {
      return formatUSD(usdAmount);
    }
    return;
  }, [usdAmount]);

  return {
    asset,
    chain,
    assetImage,
    chainName,
    chainImage,
    symbol,
    formattedAmount,
    formattedUsdAmount,
    usdAmount,
  };
};
