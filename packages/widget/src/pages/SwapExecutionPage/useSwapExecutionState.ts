// useSwapExecutionState.ts
import { useMemo } from "react";
import { ChainAddress } from "@/state/swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import {
  SwapExecutionState,
  computeSwapExecutionState,
} from "@/utils/swapExecutionState";
import { RouteResponse } from "@skip-go/client";

type UseSwapExecutionStateParams = {
  chainAddresses: Record<number, ChainAddress>;
  route?: RouteResponse;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: { status: string };
  signaturesRemaining: number;
  isLoading: boolean;
};

export function useSwapExecutionState({
  chainAddresses,
  route,
  overallStatus,
  isValidatingGasBalance,
  signaturesRemaining,
  isLoading,
}: UseSwapExecutionStateParams): SwapExecutionState {
  return useMemo(
    () =>
      computeSwapExecutionState({
        chainAddresses,
        route,
        overallStatus,
        isValidatingGasBalance,
        signaturesRemaining,
        isLoading,
      }),
    [
      isLoading,
      chainAddresses,
      route?.requiredChainAddresses,
      overallStatus,
      isValidatingGasBalance,
      signaturesRemaining,
    ],
  );
}
