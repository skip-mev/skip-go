import {
  ClientAsset,
  skipAssetsAtom,
  skipChainsAtom,
} from "@/state/skipClient";
import { getFormattedAssetAmount } from "@/utils/crypto";
import { formatUSD } from "@/utils/intl";
import { Chain } from "@skip-go/client";
import { useAtom } from "jotai";

export type AssetDetails = {
  asset?: ClientAsset;
  symbol?: string;
  chain?: Chain;
  chainName?: string;
  chainImage?: string;
  formattedAmount?: string;
  formattedUsdAmount?: string;
};

/**
 * @param {Object} params - The parameters for fetching asset details.
 * @param {string} params.assetDenom - The denomination of the asset to retrieve details for.
 * @param {string} [params.amount] - Optional. The amount of the asset, used for formatting.
 * @param {string} [params.chainId] - Optional. The ID of the chain associated with the asset.
 *
 * @returns {AssetDetails} An object containing the following properties:
 * - `asset` (ClientAsset | undefined): The asset object corresponding to the provided denomination.
 * - `chain` (Chain | undefined): The chain object associated with the provided chain ID.
 * - `chainName` (string | undefined): The name of the chain, derived from the chain object.
 * - `symbol` (string | undefined): The symbol of the asset, derived from the asset object.
 * - `formattedAmount` (string | undefined): The formatted amount of the asset, if the amount is provided.
 * - `formattedUsdAmount` (string | undefined): The formatted usd amount of the asset, if the amountUsd is provided.
 */
export const useGetAssetDetails = ({
  assetDenom,
  amount,
  amountUsd,
  chainId,
}: {
  assetDenom?: string;
  amount?: string;
  amountUsd?: string;
  chainId?: string;
}): AssetDetails => {
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);

  const asset = assets?.find((asset) => asset.denom === assetDenom);
  const symbol = asset?.recommendedSymbol ?? asset?.symbol;

  const chain = chains?.find((chain) => {
    if (chainId) {
      return chain.chainID === chainId;
    } else {
      return chain.chainID === asset?.chainID;
    }
  });
  const chainName = chain?.prettyName ?? chain?.chainName;
  const chainImage = chain?.logoURI;

  const formattedAmount = amount
  ? getFormattedAssetAmount(amount, asset?.decimals)
  : undefined;
  const formattedUsdAmount = amountUsd ? formatUSD(amountUsd) : undefined;

  return {
    asset,
    chain,
    chainName,
    chainImage,
    symbol,
    formattedAmount,
    formattedUsdAmount,
  };
};
