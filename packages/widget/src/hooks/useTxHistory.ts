import { setTransactionHistoryAtom } from "@/state/history";
import { RouteDetails, subscribeToRouteStatus } from "@skip-go/client";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type useTxHistoryProps = {
  txHistoryItem?: RouteDetails;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (txHistoryItem && !subscribed) {
      subscribeToRouteStatus({
        routeDetails: txHistoryItem,
        onRouteStatusUpdated: (routeStatus) => setTransactionHistory(routeStatus),
      });
      setSubscribed(true);
    }
  }, [setTransactionHistory, subscribed, txHistoryItem]);

  return txHistoryItem;
};
