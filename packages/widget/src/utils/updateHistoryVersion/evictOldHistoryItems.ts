/* eslint-disable no-console */

import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";
import { jotaiStore } from "@/widget/Widget";
import { RouteDetails } from "@skip-go/client";
import { getNumberOfHistoryItemsToEvict } from "../storage";
import { transactionHistoryAtom } from "@/state/history";

export const evictOldHistoryItems = () => {
  const { set } = jotaiStore;

  try {
    const transactionHistory: RouteDetails[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.transactionHistory) ?? "[]",
    );
    if (!transactionHistory || transactionHistory.length === 0) {
      return;
    }

    const itemsToRemove = getNumberOfHistoryItemsToEvict();

    if (itemsToRemove === 0) {
      console.log("Local storage within buffer limits, no eviction needed");
      return;
    }

    const itemsToKeep = Math.max(1, transactionHistory.length - itemsToRemove);

    console.info(`Will remove ${itemsToRemove} items, keeping ${itemsToKeep} most recent items`);

    const sortedHistory = [...transactionHistory].sort((a, b) => {
      const timestampA = a.timestamp || 0;
      const timestampB = b.timestamp || 0;
      return timestampB - timestampA;
    });

    const evictedItems = sortedHistory.slice(itemsToKeep);
    const keptItems = sortedHistory.slice(0, itemsToKeep);

    console.log(`Evicted ${evictedItems.length} old history items`);
    console.log(`Kept ${keptItems.length} most recent history items`);

    localStorage.setItem(LOCAL_STORAGE_KEYS.transactionHistory, JSON.stringify(keptItems));

    set(transactionHistoryAtom, keptItems);
  } catch (error) {
    console.warn("Failed to evict old history items:", error);
  }
};
