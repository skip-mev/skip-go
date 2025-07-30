import type { TransactionCallbacks } from "../types/callbacks";
import {
  type CosmosMsg,
  type RouteResponse,
  type PostHandler,
  type CosmosTx,
  ChainType,
  type Tx,
  type Route,
} from "../types/swaggerTypes";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";
import type {
  SignerGetters,
  GasOptions,
  UserAddress,
  BaseSettings,
  TxResult,
} from "src/types/client-types";
import {
  executeAndSubscribeToRouteStatus,
  updateRouteDetails,
  type RouteDetails,
  type RouteStatus,
} from "./subscribeToRouteStatus";
import {
  createValidAddressList,
  validateUserAddresses,
} from "src/utils/address";
import { ApiState } from "src/state/apiState";
import { messages, type MessagesResponse } from "src/api/postMessages";
import { executeTransactions } from "src/private-functions/executeTransactions";
import { v4 as uuidv4 } from "uuid";
import { trackTransaction } from "src/api/postTrackTransaction";

/** Execute Routes Options */
export type ExecuteMultipleRoutesOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks &
  Omit<BaseSettings, "slippageTolerancePercent"> &
  Pick<ApiRequest<"msgs">, "timeoutSeconds"> & {
    route: { mainRoute: RouteResponse } & Record<string, RouteResponse>;
    /**
     * Addresses should be in the same order with the `requiredChainAddresses` in the `route`
     */
    userAddresses: { mainRoute: UserAddress[] } & Record<string, UserAddress[]>;
    /**
     * If `appendCosmosMsgs` is provided, it will append the specified Cosmos messages to the transactions.
     */
    appendCosmosMsgs?: Record<string, Record<string, CosmosMsg[]>>;
    /**
     * Specify actions to perform after the route is completed
     */
    postRouteHandler?: Record<string, PostHandler>;
    slippageTolerancePercent?: { mainRoute: string } & Record<string, string>;
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
    slippageTolerancePercent,
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
        slippageTolerancePercent: slippageTolerancePercent?.[routeKey] || "1",
        chainIdsToAffiliates: ApiState.chainIdsToAffiliates,
        postRouteHandler: postRouteHandler?.[routeKey],
        feePayerAddress: options.svmFeePayer?.address,
      });
    })
  );
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

  let transferIndexToRouteKey: Record<number, string> | undefined = undefined;

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

      if (!transferIndexToRouteKey) {
        transferIndexToRouteKey = {};
      }

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
  // clean data
  Object.entries(msgsRecord).forEach(([routeKey, msgs]) => {
    if (msgs?.txs?.length === 0) {
      delete msgsRecord[routeKey];
    }
  });

  let mainRouteId: string | undefined = undefined;

  let msgsRecordIndexToRouteId: Record<number, string> = {};

  let index = 0;

  const transactionDetailsList: Record<
    number,
    {
      chainId: string;
    }[]
  > = {};
  const executeTransactionList: Record<
    number,
    (index: number) => Promise<TxResult>
  > = {};

  const mergedMainAndSecondaryRoutes =
    Object.entries(msgsRecord).length !== Object.entries(route).length;

  for (const [routeKey, msgsResponse] of Object.entries(msgsRecord)) {
    const { id: routeId } = updateRouteDetails({
      status: "unconfirmed",
      options: {
        route: route[routeKey],
        ...restOptions,
      },
      mainRouteId,
      transferIndexToRouteKey,
    });

    msgsRecordIndexToRouteId[index] = routeId;

    if (routeKey === "mainRoute") {
      mainRouteId = routeId;
    }

    const { transactionDetails, executeTransaction: _executeTransaction } =
      await executeTransactions({
        ...restOptions,
        routeId,
        txs: msgsResponse?.txs,
        route: route[routeKey]!,
        userAddresses: userAddresses[routeKey]!,
        isMultiRoutes: true,
      });

    const executeTransaction = async (index: number) => {
      const txResult = await _executeTransaction(index);

      if (routeKey !== "mainRoute" || mergedMainAndSecondaryRoutes) {
        const relatedRoutes = Object.entries(route)
        .filter(([key]) => key !== "mainRoute")
        .map(([key, route]) => ({ route, routeKey: key, status: "pending" as RouteStatus }));
        updateRouteDetails({
          options: {
            route: route[routeKey],
            ...restOptions,
          },
          routeId: mainRouteId,
          transferIndexToRouteKey,
          relatedRoutes,
        });
      }
      return txResult;
    };

    if (transactionDetails[0]?.chainType === ChainType.Evm) {
      for (const [index, transactionDetail] of transactionDetails.entries()) {
        const txResult = await executeTransaction(index);
        if (txResult.txHash) {
          const trackResponse = await trackTransaction({
            chainId: transactionDetail.chainId,
            txHash: txResult.txHash,
            ...options.trackTxPollingOptions,
          });

          await options?.onTransactionTracked?.({
            txHash: txResult.txHash,
            chainId: transactionDetail.chainId,
            explorerLink: trackResponse.explorerLink,
          });

          transactionDetail.txHash = txResult.txHash;
          transactionDetail.explorerLink = trackResponse.explorerLink;
        }
      }
    } else {
      executeTransactionList[index] = executeTransaction;
    }
    transactionDetailsList[index] = transactionDetails;

    index++;
  }

  await Promise.all(
    Object.entries(msgsRecord).map(([routeKey, msgsResponse], index) => {
      return executeAndSubscribeToRouteStatus({
        transactionDetails: transactionDetailsList[index],
        executeTransaction: executeTransactionList[index],
        routeId: msgsRecordIndexToRouteId[index],
        options: {
          route: route[routeKey]!,
          userAddresses: userAddresses[routeKey]!,
          ...restOptions,
          onRouteStatusUpdated: (routeStatus) => {
            console.log(`[onRouteStatusUpdated] ${routeKey}`, routeStatus);
  
            const relatedRoutes = Object.entries(route)
            .filter(([key]) => key !== "mainRoute")
            .map(([key, route]) => ({ route, routeKey: key, status: routeStatus.status }));
  
  
            if (routeKey !== "mainRoute") {
              console.log('route status not main route', routeStatus, relatedRoutes);
              updateRouteDetails({
                options: {
                  route: route[routeKey],
                  ...restOptions,
                },
                routeId: mainRouteId,
                transferIndexToRouteKey,
                relatedRoutes,
              });
            }
            options.onRouteStatusUpdated?.(routeStatus);
          },
        },
      });
    })
  );
};
