import { getClientOperations } from "@/utils/clientType";
import { OperationType } from "@/utils/clientType";
import { RouteResponse } from "@skip-go/client";
import { useMemo } from "react";

export const useIsGoFast = (route: RouteResponse | undefined) => {
  return useMemo(() => {
    const clientOperations = getClientOperations(route?.operations);
    return clientOperations?.some((item) => item.type === OperationType.goFastTransfer) ?? false;
  }, [route?.operations]);
};

export const useIsSwapOperation = (route: RouteResponse | undefined) => {
  return useMemo(() => {
    const swapOperations = [OperationType.swap, OperationType.evmSwap];
    const clientOperations = getClientOperations(route?.operations);
    return clientOperations?.some((item) => swapOperations.includes(item.type)) ?? false;
  }, [route?.operations]);
};
