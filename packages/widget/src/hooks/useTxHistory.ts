import { setTransactionHistoryAtom } from "@/state/history";
import { RouteDetails, subscribeToRouteStatus } from "@skip-go/client";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

type useTxHistoryProps = {
  txHistoryItem?: RouteDetails;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  useEffect(() => {
    subscribeToRouteStatus({
      routeDetails: txHistoryItem,
      onRouteStatusUpdated: (routeStatus) => {
        setTransactionHistory(routeStatus);
      },
    });
  }, []);

  return txHistoryItem;
};
