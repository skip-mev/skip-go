// useSwapExecutionState.ts
import { useMemo } from "react";
import { ChainAddress } from "@/state/swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import { RouteResponse } from "@skip-go/client";
import { SwapExecutionState } from "./SwapExecutionPage";

interface UseSwapExecutionStateParams {
  chainAddresses: Record<number, ChainAddress>;
  route?: RouteResponse;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: { status: string };
  signaturesRemaining: number;
}

export function useSwapExecutionState({
  chainAddresses,
  route,
  overallStatus,
  isValidatingGasBalance,
  signaturesRemaining,
}: UseSwapExecutionStateParams): SwapExecutionState {
  return useMemo(() => {
    if (!chainAddresses) return SwapExecutionState.destinationAddressUnset;
    const requiredChainAddresses = route?.requiredChainAddresses;
    if (!requiredChainAddresses) return SwapExecutionState.destinationAddressUnset;

    const allAddressesSet = requiredChainAddresses.every(
      (_chainId, index) => chainAddresses[index]?.address
    );

    const lastChainAddress =
      chainAddresses[requiredChainAddresses.length - 1]?.address;

    if (overallStatus === "completed") {
      return SwapExecutionState.confirmed;
    }

    if (overallStatus === "pending") {
      if (signaturesRemaining > 0) {
        return SwapExecutionState.signaturesRemaining;
      }
      return SwapExecutionState.pending;
    }

    if (overallStatus === "approving") {
      return SwapExecutionState.approving;
    }

    if (
      isValidatingGasBalance &&
      isValidatingGasBalance.status !== "completed"
    ) {
      return SwapExecutionState.validatingGasBalance;
    }

    if (overallStatus === "signing") {
      return SwapExecutionState.waitingForSigning;
    }

    if (!lastChainAddress) {
      return SwapExecutionState.destinationAddressUnset;
    }

    if (!allAddressesSet) {
      return SwapExecutionState.recoveryAddressUnset;
    }

    return SwapExecutionState.ready;
  }, [
    chainAddresses,
    route?.requiredChainAddresses,
    overallStatus,
    isValidatingGasBalance,
    signaturesRemaining,
  ]);
}
