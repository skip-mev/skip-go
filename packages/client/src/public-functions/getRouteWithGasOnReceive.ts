import {
  assets,
  chains,
  ChainType,
  route,
  type Chain,
  type Asset,
  ClientState,
} from "src";
import { getUsdPrice } from "src/utils/coingecko";
import { convertHumanReadableAmountToCryptoAmount } from "src/utils/numbers";
import BigNumber from "bignumber.js";
import { createPublicClient, fallback, http } from "viem";
import { evmChains } from "src/constants/evmChains";
import type { RouteRequest, RouteResponse } from "src/types";
import { isSubset } from "src/utils/array";

const GAS_ON_RECEIVE_AMOUNT_USD = {
  [ChainType.Cosmos]: 0.1,
  evm_l2: 2,
};

const DISABLED_SOURCE_CHAINIDS = ["1", "11155111"];
const DISABLED_DESTINATION_CHAINIDS = ["solana", "solana-devnet"];

/**
 *  Routes with gas on receive.
 *  This function finds a route for the given source and destination assets, and then finds a gas route for the destination chain.
 *
 */
export const getRouteWithGasOnReceive = async (props: {
  routeResponse: RouteResponse;
  routeRequest: RouteRequest;
  onlyTestnets?: boolean;
}) => {
  const originalRoute = props.routeResponse;
  try {
    if (DISABLED_SOURCE_CHAINIDS.includes(originalRoute.sourceAssetChainId)) {
      throw new Error(
        `Routes from ${originalRoute.sourceAssetChainId} are not supported`
      );
    }
    if (
      DISABLED_DESTINATION_CHAINIDS.includes(originalRoute.destAssetChainId)
    ) {
      throw new Error(
        `Routes to ${originalRoute.destAssetChainId} are not supported`
      );
    }

    const skipChains = ClientState.skipChains
      ? ClientState.skipChains
      : await chains({
          includeEvm: true,
          includeSvm: true,
          chainIds: [
            originalRoute.sourceAssetChainId,
            originalRoute.destAssetChainId,
          ],
          onlyTestnets: props.onlyTestnets,
        });
    const skipAssets = ClientState.skipAssets
      ? ClientState.skipAssets
      : await assets({
          chainIds: [
            originalRoute.sourceAssetChainId,
            originalRoute.destAssetChainId,
          ],
          includeEvmAssets: true,
          includeSvmAssets: true,
          onlyTestnets: props.onlyTestnets,
        });

    const destinationChain = skipChains?.find(
      (chain) => chain.chainId === originalRoute.destAssetChainId
    );

    if (
      destinationChain?.feeAssets
        .map((i) => i.denom)
        .includes(originalRoute.destAssetDenom)
    ) {
      throw new Error(
        "Destination asset is already a fee asset on the destination chain"
      );
    }

    const gasOnReceiveAmount = await getGasOnReceiveAmount({
      destinationChain,
      skipAssets,
      sourceAsset: skipAssets?.[originalRoute.sourceAssetChainId]?.find(
        (i) => i.denom === originalRoute.sourceAssetDenom
      ),
    });
    if (!gasOnReceiveAmount || gasOnReceiveAmount.length === 0) {
      throw new Error(
        "No gas on receive amount found for the destination chain"
      );
    }

    const splitDenoms = chunkArray(gasOnReceiveAmount, 3);
    let gasRoute: RouteResponse | undefined;
    for (const chunk of splitDenoms) {
      const feeAssetRoutes = chunk.map(
        async ({ amountOut, denom, amountIn }) => {
          try {
            const res = await route({
              ...props.routeRequest,
              destAssetDenom: denom,
              amountIn: amountIn,
              amountOut: amountOut,
              allowMultiTx: false,
            });
            return res;
          } catch (_e) {
            return null;
          }
        }
      );
      const result = await Promise.all(feeAssetRoutes);
      const _gasRoute = result.find((result) => result?.usdAmountOut);
      if (_gasRoute?.usdAmountOut) {
        gasRoute = _gasRoute;
        break;
      }
    }

    if (!gasRoute) {
      throw new Error(
        "No gas route found for the destination chain with the provided assets"
      );
    }

    const mainRouteAmountIn = BigNumber(originalRoute?.amountIn ?? 0)
      .minus(BigNumber(gasRoute.amountIn ?? 0))
      .toString();

    const mainRoute: RouteResponse | undefined = await route({
      ...props.routeRequest,
      amountIn: mainRouteAmountIn,
      amountOut: undefined,
    });
    if (!mainRoute) {
      throw new Error("No main route found with the provided assets");
    }
    if (
      originalRoute.txsRequired !== mainRoute.txsRequired ||
      !isSubset(
        originalRoute?.requiredChainAddresses,
        mainRoute.requiredChainAddresses
      )
    ) {
      throw new Error("Main route does not match the original route");
    }

    return {
      mainRoute,
      gasRoute,
    };
  } catch (error) {
    return {
      mainRoute: originalRoute,
      gasRoute: undefined,
    };
  }
};

const getGasOnReceiveAmount = async ({
  destinationChain,
  skipAssets,
  sourceAsset,
}: {
  destinationChain?: Chain;
  skipAssets?: Record<string, Asset[]>;
  sourceAsset?: Asset;
}): Promise<
  | {
      amountIn?: string;
      amountOut?: string;
      denom?: string;
    }[]
  | undefined
> => {
  switch (destinationChain?.chainType) {
    case ChainType.Cosmos: {
      const usdPrice = sourceAsset?.coingeckoId
        ? await getUsdPrice(sourceAsset.coingeckoId)
        : undefined;
      return destinationChain.feeAssets
        .map((asset) => {
          const destinationAsset = skipAssets?.[destinationChain.chainId]?.find(
            (i) => i.denom === asset.denom
          );
          const gasPrice =
            asset.gasPrice?.average ??
            asset.gasPrice?.high ??
            asset.gasPrice?.low;

          if (!gasPrice || Number(gasPrice) === 0) {
            if (!usdPrice || !sourceAsset?.decimals) return;
            const gasOnReceiveAmountUsd = GAS_ON_RECEIVE_AMOUNT_USD["cosmos"];
            const amountIn = BigNumber(gasOnReceiveAmountUsd)
              .multipliedBy(usdPrice)
              .toString();
            return {
              amountIn: convertHumanReadableAmountToCryptoAmount(
                amountIn,
                sourceAsset.decimals
              ),
              amountOut: undefined,
              denom: asset.denom,
            };
          }
          return {
            amountIn: undefined,
            amountOut:
              gasPrice && destinationAsset?.decimals
                ? convertHumanReadableAmountToCryptoAmount(
                    BigNumber(gasPrice).multipliedBy(3).toNumber(),
                    destinationAsset.decimals
                  )
                : undefined,
            denom: asset.denom,
          };
        })
        .filter(Boolean) as {
        amountIn?: string;
        amountOut?: string;
        denom?: string;
      }[];
    }
    case ChainType.Evm: {
      const sourceAssetPrice = sourceAsset?.coingeckoId
        ? await getUsdPrice(sourceAsset?.coingeckoId)
        : undefined;
      const destinationAsset = skipAssets?.[destinationChain.chainId]?.find(
        (i) => i.denom.includes("-native")
      );
      if (!sourceAssetPrice) {
        const chain = evmChains.find(
          (chain) => chain.id === Number(destinationChain?.chainId)
        );
        const client = createPublicClient({
          chain,
          transport: fallback([
            http("https://ethereum.publicnode.com"),
            http("https://rpc.ankr.com/eth"),
            http("https://cloudflare-eth.com"),
          ]),
        });
        const fees = await client.estimateFeesPerGas();
        return [
          {
            amountIn: undefined,
            amountOut: BigNumber(150_000)
              .multipliedBy(fees.maxFeePerGas.toString())
              .multipliedBy(3)
              .toString(),
            denom: destinationAsset?.denom,
          },
        ];
      }
      const gasPrice = BigNumber(GAS_ON_RECEIVE_AMOUNT_USD["evm_l2"]).dividedBy(
        sourceAssetPrice
      ).toString()

      return [
        {
          amountOut: undefined,
          amountIn: sourceAsset?.decimals
            ? convertHumanReadableAmountToCryptoAmount(
                gasPrice,
                sourceAsset.decimals
              )
            : undefined,
          denom: destinationAsset?.denom,
        },
      ];
    }
    default: {
      return;
    }
  }
};

const chunkArray = <T>(arr: T[], size = 3): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
