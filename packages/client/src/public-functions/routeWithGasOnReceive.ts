import {
  assets,
  chains,
  ChainType,
  route,
  type Chain,
  type Asset,
} from "src";
import { getUsdPrice } from "src/utils/coingecko";
import {
  convertHumanReadableAmountToCryptoAmount,
} from "src/utils/numbers";
import BigNumber from "bignumber.js";
import { createPublicClient, fallback, http } from "viem";
import { evmChains } from "src/constants/evmChains";
import type { RouteRequest, RouteResponse } from "src/types";
import { isSubset } from "src/utils/array";

const GAS_ON_RECEIVE_AMOUNT_USD = {
  [ChainType.Cosmos]: 0.1,
  evm_l2: 2,
};

const DISABLED_SOURCE_CHAINIDS = ["1", "11155111"]
const DISABLED_DESTINATION_CHAINIDS = ["solana", "solana-devnet"];

/**
 *  Routes with gas on receive.
 *  This function finds a route for the given source and destination assets, and then finds a gas route for the destination chain.
 *
 */
export const routeWithGasOnReceive = async (request: RouteRequest & { onlyTestnets?: boolean}) => {
  if (!request.sourceAssetChainId || !request.destAssetChainId || !request.destAssetDenom || !request.sourceAssetDenom) {
    throw new Error("sourceAssetChainId, destAssetChainId, sourceAssetDenom and destAssetDenom are required");
  }
  const originalRoute = await route(request);
  if (!originalRoute) {
    throw new Error("No route found with the provided assets");
  }
  try {
    if (DISABLED_SOURCE_CHAINIDS.includes(request.sourceAssetChainId)) {
      throw new Error(
        `Routes from ${request.sourceAssetChainId} are not supported`
      );
    }
    if (DISABLED_DESTINATION_CHAINIDS.includes(request.destAssetChainId)) {
      throw new Error(
        `Routes to ${request.destAssetChainId} are not supported`
      );
    }

    const skipChains = await chains({
      includeEvm: true,
      includeSvm: true,
      chainIds: [request.sourceAssetChainId, request.destAssetChainId],
      onlyTestnets: request.onlyTestnets,
    });
    const skipAssets = await assets({
      chainIds: [request.sourceAssetChainId, request.destAssetChainId],
      includeEvmAssets: true,
      includeSvmAssets: true,
      onlyTestnets: request.onlyTestnets,
    });

    const destinationChain = skipChains?.find(
      (chain) => chain.chainId === request.destAssetChainId
    );

    if (destinationChain?.feeAssets.map(i => i.denom).includes(request.destAssetDenom)) {
      throw new Error(
        "Destination asset is already a fee asset on the destination chain"
      );
    }

    const gasOnReceiveAmount = await getGasOnReceiveAmount({
      destinationChain,
      skipAssets,
    });
    if (!gasOnReceiveAmount) {
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
              ...request,
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

    const mainRoute = await route({
      ...request,
      amountIn: mainRouteAmountIn,
      amountOut: undefined,
    });
    if (!mainRoute) {
      throw new Error("No main route found with the provided assets");
    }
    if ((originalRoute.txsRequired !== mainRoute.txsRequired) || !isSubset(originalRoute?.requiredChainAddresses, mainRoute.requiredChainAddresses)) {
      throw new Error(
        "Main route does not match the original route"
      );
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
}: {
  destinationChain?: Chain;
  skipAssets?: Record<string, Asset[]>;
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
      return destinationChain.feeAssets.map((asset) => {
        const gasPrice =
          asset.gasPrice?.average ??
          asset.gasPrice?.high ??
          asset.gasPrice?.low;
        const destinationAsset = skipAssets?.[destinationChain.chainId]?.find(
          (i) => i.denom === asset.denom
        );

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
      });
    }
    case ChainType.Evm: {
      const ethPrice = await getUsdPrice("ethereum");
      const destinationAsset = skipAssets?.[destinationChain.chainId]?.find(
        (i) => i.denom.includes("-native")
      );
      if (!ethPrice) {
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
              .multipliedBy(fees.maxFeePerGas.toString()).multipliedBy(3)
              .toString(),
            denom: destinationAsset?.denom,
          },
        ];
      }
      const gasPrice = BigNumber(ethPrice).multipliedBy(
        GAS_ON_RECEIVE_AMOUNT_USD["evm_l2"]
      );

      return [
        {
          amountOut: undefined,
          amountIn: destinationAsset?.decimals
            ? convertHumanReadableAmountToCryptoAmount(
                gasPrice.toNumber(),
                destinationAsset.decimals
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
