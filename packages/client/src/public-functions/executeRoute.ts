import { PublicKey } from "@solana/web3.js";
import { ClientState } from "../state/clientState";
import type { TransactionCallbacks } from "../types/callbacks";
import { ChainType } from "../types/swaggerTypes";
import type { CosmosMsg, RouteResponse, PostHandler } from "../types/swaggerTypes";
import type { ApiRequest } from "../utils/generateApi";
import { bech32m, bech32 } from "bech32";
import { executeTransactions } from "../private-functions/executeTransactions";
import { messages } from "../api/postMessages";
import { isAddress } from "viem";
import type {
  SignerGetters,
  GasOptions,
  UserAddress,
} from "src/types/client-types";
import { ApiState } from "src/state/apiState";
import type { TrackTxPollingProps } from "src/api/postTrackTransaction";

/** Execute Route Options */
export type ExecuteRouteOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks &
  Pick<ApiRequest<"msgs">, "timeoutSeconds"> & {
    route: RouteResponse;
    /**
     * Addresses should be in the same order with the `chainIDs` in the `route`
     */
    userAddresses: UserAddress[];
    simulate?: boolean;
    slippageTolerancePercent?: string;
    /**
     * Arbitrary Tx to be executed before or after route msgs
     */
    beforeMsg?: CosmosMsg;
    afterMsg?: CosmosMsg;
    /**
     * Set allowance amount to max if EVM transaction requires allowance approval.
     */
    useUnlimitedApproval?: boolean;
    /**
    /**
     * If `skipApproval` is set to `true`, the router will bypass checking whether
     * the signer has granted approval for the specified token contract on an EVM chain.
     * This can be useful if approval has already been handled externally or there are race conditions.
     */
    bypassApprovalCheck?: boolean;
    /**
     * defaults to true
     * If `batchSimulate` is set to `true`, it will simulate all messages in a batch before the first tx run.
     * If `batchSimulate` is set to `false`, it will simulate each message one by one.
     */
    batchSimulate?: boolean;
    /**
     * Optional configuration for transaction polling behavior.
     * - `maxRetries`: Maximum number of polling attempts (default: 5)
     * - `retryInterval`: Retry interval in milliseconds (default: 1000)
     * - `backoffMultiplier`: Exponential backoff multiplier for increasing delay between retries (default: 2.5)
     * Example backoff with retryInterval = 1000 and backoffMultiplier = 2:
     * 1st retry: 1000ms → 2nd: 2000ms → 3rd: 4000ms → 4th: 8000ms ...
     */
    trackTxPollingOptions?: TrackTxPollingProps;
    /**
     * If `batchSignTxs` is set to `true`, it will sign all transactions in a batch up front.
     * If `batchSignTxs` is set to `false`, it will sign each transaction one by one.
     */
    batchSignTxs?: boolean;
    /**
     * Specify actions to perform after the route is completed
     */
    postRouteHandler?: PostHandler;
  };

export const executeRoute = async (options: ExecuteRouteOptions) => {
  const { route, userAddresses, beforeMsg, afterMsg, timeoutSeconds } = options;

  let addressList: string[] = [];
  userAddresses.forEach((userAddress, index) => {
    const requiredChainAddress = route.requiredChainAddresses[index];

    if (requiredChainAddress === userAddress?.chainId) {
      addressList.push(userAddress.address);
    }
  });

  if (addressList.length !== route.requiredChainAddresses.length) {
    addressList = userAddresses.map((x) => x.address);
  }

  const validLength =
    addressList.length === route.requiredChainAddresses.length ||
    addressList.length === route.chainIds?.length;

  if (!validLength) {
    throw new Error("executeRoute error: invalid address list");
  }

  const isUserAddressesValid = await validateUserAddresses(userAddresses);

  if (!isUserAddressesValid) {
    throw new Error("executeRoute error: invalid user addresses");
  }

  const response = await messages({
    timeoutSeconds,
    amountIn: route?.amountIn,
    amountOut: route.estimatedAmountOut || "0",
    sourceAssetChainId: route?.sourceAssetChainId,
    sourceAssetDenom: route?.sourceAssetDenom,
    destAssetChainId: route?.destAssetChainId,
    destAssetDenom: route?.destAssetDenom,
    operations: route?.operations,
    addressList: addressList,
    slippageTolerancePercent: options.slippageTolerancePercent || "1",
    chainIdsToAffiliates: ApiState.chainIdsToAffiliates,
    postRouteHandler: options.postRouteHandler,
  });

  if (beforeMsg && (response?.txs?.length ?? 0) > 0) {
    const firstTx = response?.txs?.[0];
    if (firstTx && "cosmosTx" in firstTx) {
      firstTx.cosmosTx?.msgs?.unshift(beforeMsg);
    }
  }

  if (afterMsg && (response?.txs?.length ?? 0) > 0) {
    const lastTx = response?.txs?.[response.txs.length - 1];
    if (lastTx && "cosmosTx" in lastTx) {
      lastTx.cosmosTx?.msgs?.push(afterMsg);
    }
  }

  await executeTransactions({ ...options, txs: response?.txs });
};

const validateUserAddresses = async (userAddresses: UserAddress[]) => {
  const chains = await ClientState.getSkipChains();
  const validations = userAddresses.map((userAddress) => {
    const chain = chains.find((chain) => chain.chainId === userAddress.chainId);

    switch (chain?.chainType) {
      case ChainType.Cosmos:
        try {
          if (chain.chainId?.includes("penumbra")) {
            try {
              return (
                chain.bech32Prefix ===
                bech32m.decode(userAddress.address, 143)?.prefix
              );
            } catch {
              // The temporary solution to route around Noble address breakage.
              // This can be entirely removed once `noble-1` upgrades.
              return ["penumbracompat1", "tpenumbra"].includes(
                bech32.decode(userAddress.address, 1023).prefix
              );
            }
          }
          return (
            chain.bech32Prefix ===
            bech32.decode(userAddress.address, 1023).prefix
          );
        } catch {
          return false;
        }

      case ChainType.Evm:
        try {
          return isAddress(userAddress.address);
        } catch (_error) {
          return false;
        }
      case ChainType.Svm:
        try {
          const publicKey = new PublicKey(userAddress.address);
          return PublicKey.isOnCurve(publicKey);
        } catch (_error) {
          return false;
        }
      default:
        return false;
    }
  });

  return validations.every((validation) => validation);
};
