import { ClientAsset, skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { Chain } from "@skip-go/client";
import {
  convertTokenAmountToHumanReadableAmount,
  convertHumanReadableAmountToCryptoAmount,
} from "@/utils/crypto";
import { useAtom } from "jotai";
import { useMemo } from "react";

export type AssetDetailsProps = {
  asset?: ClientAsset;
  chain?: Chain;
  symbol?: string;
  assetImage?: string;
  chainName?: string;
  chainImage?: string;
  amount?: string;
  tokenAmount?: string;
  decimals?: number;
};

/**
 * @param {string} [params.assetDenom] - The denomination of the asset to retrieve details for
 * @param {string} [params.amount] - The human-readable amount amount of the asset
 * @param {string} [params.tokenAmount] - The token/raw amount of the asset
 * @param {string} [params.chainId] - The id of the chain associated with the asset
 *
 * @returns {AssetDetails} An object containing the following properties:
 * - `asset` The asset object corresponding to the provided denomination
 * - `chain` The chain object associated with the provided chain id
 * - `symbol` The symbol of the asset, derived from the asset object
 * - `assetImage` The asset image url derived from the asset object
 * - `chainName` The name of the chain, derived from the chain object
 * - `chainImage` The chain image url, derived from the chain object
 * - `amount` The human-readable amount of the asset
 * - `tokenAmount` The token/raw amount of the asset
 */
export const useGetAssetDetails = ({
  assetDenom,
  amount,
  tokenAmount,
  chainId,
}: {
  assetDenom?: string;
  amount?: string;
  tokenAmount?: string;
  chainId?: string;
}): AssetDetailsProps => {
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);

  const asset = useMemo(() => {
    if (!assetDenom || !chainId) return;
    if (!assets) return;
    return assets.find(
      (a) =>
        a.denom?.toLowerCase() === assetDenom.toLowerCase() &&
        a.chainId?.toLowerCase() === chainId.toLowerCase(),
    );
  }, [assets, assetDenom, chainId]);

  if (!amount && tokenAmount) {
    amount = convertTokenAmountToHumanReadableAmount(tokenAmount, asset?.decimals);
  } else if (!tokenAmount && amount) {
    tokenAmount = convertHumanReadableAmountToCryptoAmount(amount, asset?.decimals);
  }

  const assetImage = asset?.logoUri;
  const symbol = asset?.recommendedSymbol ?? asset?.symbol;

  const chain = chains?.find((chain) => {
    if (chainId) {
      return chain.chainId === chainId;
    }
    return chain.chainId === asset?.chainId;
  });
  const chainPrettyName =
    chain?.prettyName && chain?.prettyName.length !== 0 ? chain.prettyName : undefined;
  const chainName = chain?.chainName && chain?.chainName.length !== 0 ? chain.chainName : undefined;

  const chainImage = chain?.logoUri;
  const decimals = asset?.decimals;

  if (!chainId) {
    return {
      asset: undefined,
      chain: undefined,
      assetImage: undefined,
      chainName: undefined,
      chainImage: undefined,
      symbol: undefined,
      amount: undefined,
      tokenAmount: undefined,
    };
  }

  return {
    asset,
    chain,
    assetImage: assetImage ?? "",
    chainName: chainPrettyName ?? chainName ?? chainId,
    chainImage: chainImage ?? "",
    symbol: symbol ?? "",
    amount,
    tokenAmount,
    decimals: decimals ?? undefined,
  };
};
