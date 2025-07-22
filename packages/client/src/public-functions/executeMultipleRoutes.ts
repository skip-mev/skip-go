import type { TransactionCallbacks } from "../types/callbacks";
import type {
  CosmosMsg,
  RouteResponse,
  PostHandler,
  CosmosTx,
} from "../types/swaggerTypes";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";
import type {
  SignerGetters,
  GasOptions,
  UserAddress,
  BaseSettings,
} from "src/types/client-types";
import { executeAndSubscribeToRouteStatus, updateRouteDetails } from "./subscribeToRouteStatus";
import { createValidAddressList, validateUserAddresses } from "src/utils/address";
import { ApiState } from "src/state/apiState";
import { messages, type MessagesResponse } from "src/api/postMessages";
import { executeTransactions } from "src/private-functions/executeTransactions";
import { v4 as uuidv4 } from "uuid";

/** Execute Routes Options */
export type ExecuteMultipleRoutesOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks &
  BaseSettings &
  Pick<ApiRequest<"msgs">, "timeoutSeconds"> & {
    route: { mainRoute: RouteResponse } & Record<string, RouteResponse>;
    /**
     * Addresses should be in the same order with the `requiredChainAddresses` in the `route`
     */
    userAddresses: Record<string, UserAddress[]>;
    /**
     * If `appendCosmosMsgs` is provided, it will append the specified Cosmos messages to the transactions.
     */
    appendCosmosMsgs?: Record<string, Record<string, CosmosMsg[]>>;
    /**
     * Specify actions to perform after the route is completed
     */
    postRouteHandler?: Record<string, PostHandler>;
    setNonce?: (latestNonce: number) => number;
  };

/**
 * example:
 * ```ts
 * executeMultipleRoutes({
 *  route: {
 *   "mainRoute": mainRouteResponse,
 *   "secondaryRoute": secondaryRouteResponse
 *  }
 *  userAddresses: {
 *   "mainRoute": [
 *    {chainId: "cosmos", address: "cosmos1..."},
 *    {chainId: "ethereum", address: "0x..."}
 *   ],
 *   "secondaryRoute": [
 *    {chainId: "cosmos", address: "cosmos1..."},
 *    {chainId: "ethereum", address: "0x..."}
 *   ]
 *  }
 * })
 *
 */
export const executeMultipleRoutes = async (
  options: ExecuteMultipleRoutesOptions
) => {

  const {
    route,
    userAddresses,
    appendCosmosMsgs,
    postRouteHandler,
    ...restOptions
  } = options;

  // address validation
  const addressList: Record<string, string[]> = {};

  for (const [routeKey, routeValue] of Object.entries(route)) {
    const _userAddresses = userAddresses[routeKey];

    if (_userAddresses === undefined) {
      throw new Error(
        `executeMultipleRoutes error: no user addresses found for route: ${routeKey}`
      );
    }

    const routeAddressList = await createValidAddressList({
      userAddresses: _userAddresses,
      route: routeValue,
    });

    addressList[routeKey] = routeAddressList;
  }

  // getting messages for each route
  const msgsResponses = await Promise.all(
    Object.entries(route).map(async ([routeKey, routeValue]) => {
      const routeAddressList = addressList[routeKey];
      if (routeAddressList === undefined) {
        throw new Error(
          `executeMultipleRoutes error: address list not found for route ${routeKey}`
        );
      }
      return await messages({
        timeoutSeconds: options.timeoutSeconds,
        amountIn: routeValue?.amountIn,
        amountOut: routeValue.estimatedAmountOut || "0",
        sourceAssetChainId: routeValue?.sourceAssetChainId,
        sourceAssetDenom: routeValue?.sourceAssetDenom,
        destAssetChainId: routeValue?.destAssetChainId,
        destAssetDenom: routeValue?.destAssetDenom,
        operations: routeValue?.operations,
        addressList: routeAddressList,
        slippageTolerancePercent: options.slippageTolerancePercent || "1",
        chainIdsToAffiliates: ApiState.chainIdsToAffiliates,
        postRouteHandler: postRouteHandler?.[routeKey],
        feePayerAddress: options.svmFeePayer?.address,
      });
    })
  );
  console.log("msgsResponses", msgsResponses);
  let msgsRecord: Record<string, Awaited<ReturnType<typeof messages>>> = {};
  msgsResponses.forEach((msg, index) => {
    const routeKey = Object.keys(route)[index];
    if (!routeKey) {
      throw new Error(
        `executeMultipleRoutes error: route key not found for index ${index}`
      );
    }
    const addedCosmosMsgs = appendCosmosMsgs?.[routeKey];
    if (addedCosmosMsgs) {
      Object.entries(addedCosmosMsgs).forEach(([chainId, msgs]) => {
        const txIndex = msg?.txs?.findIndex(
          (tx) => "cosmosTx" in tx && tx.cosmosTx.chainId === chainId
        );
        if (txIndex === undefined || txIndex === -1) return;
        const tx = msg?.txs?.[txIndex];
        if (tx && "cosmosTx" in tx) {
          tx.cosmosTx.msgs?.unshift(...msgs);
        }
      });
    }
    msgsRecord[routeKey] = msg;
  });
  console.log("after appendCosmosMsgs msgsRecord", msgsRecord);

  const transferIndexToRouteKey: Record<number, string> = {};

  const cosmosTxIndex0Map = new Map<
    string,
    { routeKey: string; firstCosmosTx: CosmosTx }
  >();

  let transferIndex = 0;

  // combine first tx if same source chain (cosmos)
  for (const [routeKey, msgs] of Object.entries(msgsRecord)) {
    const firstTx = msgs?.txs?.[0];
    if (firstTx && "cosmosTx" in firstTx) {
      const { chainId, msgs: firstTxMsgs } = firstTx.cosmosTx;

      transferIndexToRouteKey[transferIndex] = routeKey;
      transferIndex++;

      if (!cosmosTxIndex0Map.has(chainId)) {
        cosmosTxIndex0Map.set(chainId, {
          routeKey: routeKey,
          firstCosmosTx: firstTx.cosmosTx,
        });
      } else {
        const existing = cosmosTxIndex0Map.get(chainId);
        if (existing && firstTxMsgs) {
          const modifyTarget = msgsRecord[existing.routeKey]?.txs?.[0];
          if (modifyTarget && "cosmosTx" in modifyTarget) {
            modifyTarget.cosmosTx.msgs?.push(...firstTxMsgs);
            // remove the first tx from the current route
            msgsRecord[routeKey]?.txs?.shift();
          }
        }
      }
    }
  }
  console.log("updated msgsRecord", msgsRecord);
  // clean data
  Object.entries(msgsRecord).forEach(([routeKey, msgs]) => {
    if (msgs?.txs?.length === 0) {
      delete msgsRecord[routeKey];
    }
  });

  console.log("final result msgsRecord", msgsRecord);

  const combinedTransactionDetails: {
      chainId: string;
      routeKey?: string;
  }[][] = [];
  const combinedExecuteTransactions: ((index: number) => Promise<any>)[] = [];

  const { id: routeId } = updateRouteDetails({
    status: "unconfirmed",
    options: {
      route: route['mainRoute'],
      ...restOptions,
    },
    transferIndexToRouteKey,
  });

  await Promise.all(
    Object.entries(msgsRecord).map(async ([routeKey, msgsResponse]) => {
      console.log('route', route);

      const { transactionDetails, executeTransaction } = await executeTransactions({
        ...restOptions,
        routeId,
        txs: msgsResponse?.txs,
        route: route[routeKey]!,
        userAddresses: userAddresses[routeKey]!,
        bypassApprovalCheck: routeKey !== 'mainRoute',
        setNonce: routeKey !== 'mainRoute' ? (latestNonce) => {
          const nextNonce = latestNonce + 1;
          console.log('routeKey', routeKey, 'nextNonce', nextNonce)
          return nextNonce;
        }: undefined,
        useUnlimitedApproval: true
      });

      combinedTransactionDetails.push(transactionDetails.map(txDetails => ({...txDetails, routeKey })));
      combinedExecuteTransactions.push(executeTransaction);
    })
  );

  const transactionDetails: {
    chainId: string;
    groupIndex: number;
    txIndex: number;
    routeKey?: string;
    canExecuteInParallel: boolean;
  }[] = [];

  combinedTransactionDetails.forEach((group, groupIndex) => {
    group.forEach((tx, txIndex) => {
      transactionDetails.push({
        chainId: tx.chainId,
        groupIndex,
        txIndex,
        routeKey: tx.routeKey,
        canExecuteInParallel: txIndex === 0,
      });
    });
  });

  const executeTransaction = async (flatIndex: number) => {
    const txDetails = transactionDetails[flatIndex];
    if (txDetails !== undefined) {
      return combinedExecuteTransactions[txDetails?.groupIndex]?.(txDetails?.txIndex);
    }
  };

  console.log('combined stuff', combinedTransactionDetails, combinedExecuteTransactions);

  console.log(transactionDetails);

  await executeAndSubscribeToRouteStatus({
    transactionDetails: transactionDetails,
    executeTransaction,
    routeId,
    options: {
      route: route['mainRoute'],
      userAddresses: userAddresses['mainRoute']!,
      ...restOptions,
    },
  });
};
