/* eslint-disable no-console */

import { HISTORY_VERSION, transactionHistoryVersionAtom } from "@/state/history";
import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";
import { jotaiStore } from "@/widget/Widget";
import { UserAddress } from "@skip-go/client";

export const updateHistoryFromRouteDetailsToUserAddresses = () => {
  const { set } = jotaiStore;

  try {
    const transactionHistoryVersion: number = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.transactionHistoryVersion) ?? "0",
    );
    const transactionHistory: RouteDetails[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.transactionHistory) ?? "[]",
    );
    if (!transactionHistory) {
      throw new Error("transactionHistory not found in localStorage");
    }

    if (transactionHistoryVersion === HISTORY_VERSION.routeDetails) {
      const updatedTransactionHistory = transactionHistory.map((txHistoryItem) => {
        const { senderAddress, receiverAddress, ...rest } = txHistoryItem;
        return {
          ...rest,
          userAddresses: [
            {
              chainId: txHistoryItem.route.sourceAssetChainId,
              address: senderAddress,
            },
            {
              chainId: txHistoryItem.route.destAssetChainId,
              address: receiverAddress,
            },
          ],
        };
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.transactionHistory,
        JSON.stringify(updatedTransactionHistory),
      );
      console.info(
        `updated from transactionHistoryVersion ${HISTORY_VERSION.routeDetails} to ${HISTORY_VERSION.userAddresses}`,
      );
      set(transactionHistoryVersionAtom, HISTORY_VERSION.userAddresses);
    }
  } catch {
    console.warn(
      `Failed to update transactionHistoryVersion from ${HISTORY_VERSION.routeDetails} to ${HISTORY_VERSION.userAddresses}`,
    );
  }
};

export type RouteDetails = {
  route: {
    sourceAssetDenom: string;
    sourceAssetChainId: string;
    destAssetDenom: string;
    destAssetChainId: string;
  };
  senderAddress: string;
  receiverAddress: string;
  userAddresses: UserAddress[];
};
