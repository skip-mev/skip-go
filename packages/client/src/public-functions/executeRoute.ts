import type { TransactionCallbacks } from "../types/callbacks";
import type {
  CosmosMsg,
  RouteResponse,
  PostHandler,
} from "../types/swaggerTypes";
import type { ApiRequest } from "../utils/generateApi";
import { executeTransactions } from "../private-functions/executeTransactions";
import { messages } from "../api/postMessages";
import type {
  SignerGetters,
  GasOptions,
  UserAddress,
  BaseSettings,
} from "src/types/client-types";
import { ApiState } from "src/state/apiState";
import { executeAndSubscribeToRouteStatus, updateRouteDetails } from "./subscribeToRouteStatus";
import { createValidAddressList } from "src/utils/address";

/** Execute Route Options */
export type ExecuteRouteOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks &
  BaseSettings &
  Pick<ApiRequest<"msgs">, "timeoutSeconds"> & {
    route: RouteResponse;
    /**
     * Addresses should be in the same order with the `requiredChainAddresses` in the `route`
     */
    userAddresses: UserAddress[];
    /**
     * If `appendCosmosMsgs` is provided, it will append the specified Cosmos messages to the transactions.
     */
    appendCosmosMsgs?: Record<string, CosmosMsg[]>
    /**
     * Specify actions to perform after the route is completed
     */
    postRouteHandler?: PostHandler;
  };

export const executeRoute = async (options: ExecuteRouteOptions) => {
  const { route, userAddresses, appendCosmosMsgs, timeoutSeconds } = options;

  const { id: routeId } = updateRouteDetails({
    status: "unconfirmed",
    options,
  });

  const addressList = await createValidAddressList({
    userAddresses,
    route,
  });

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
    feePayerAddress: options.svmFeePayer?.address,
  });

  if (appendCosmosMsgs) {
    Object.entries(appendCosmosMsgs).forEach(([chainId, msgs]) => {
      const txIndex = response?.txs?.findIndex(
        (tx) => "cosmosTx" in tx && tx.cosmosTx.chainId === chainId
      );
      if (txIndex === undefined || txIndex === -1) return
      const tx = response?.txs?.[txIndex];
      if (tx && "cosmosTx" in tx) {
        tx.cosmosTx.msgs?.unshift(...msgs);
      }
    })
  }

  const { transactionDetails, executeTransaction } = await executeTransactions({ ...options, routeId, txs: response?.txs });

  await executeAndSubscribeToRouteStatus({
    transactionDetails: transactionDetails,
    executeTransaction,
    routeId,
    options
  });
};

