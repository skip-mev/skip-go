import { RouteDetailsWithRelatedRoutes, setTransactionHistoryAtom } from "@/state/history";
import { RouteDetails, subscribeToRouteStatus } from "@skip-go/client";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type useTxHistoryProps = {
  txHistoryItem?: RouteDetailsWithRelatedRoutes;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!txHistoryItem || subscribed) return;

    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      subscribeToRouteStatus({
        routeDetails: txHistoryItem,
        onRouteStatusUpdated: (routeStatus) => setTransactionHistory(routeStatus),
      }),
    );

    txHistoryItem.relatedRoutes?.forEach((relatedRoute) => {
      if (!relatedRoute.id) {
        relatedRoute = txHistoryItem;
      }
      unsubscribers.push(
        subscribeToRouteStatus({
          routeDetails: relatedRoute as RouteDetails,
          onRouteStatusUpdated: (routeStatus) => {
            setTransactionHistory(routeStatus);
          },
        }),
      );
    });

    setSubscribed(true);

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [setTransactionHistory, subscribed, txHistoryItem]);

  return txHistoryItem;
};
