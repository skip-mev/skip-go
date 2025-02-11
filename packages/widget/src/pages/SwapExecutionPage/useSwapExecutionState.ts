// useSwapExecutionState.ts
import { useMemo } from "react";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import { RouteResponse } from "@skip-go/client";
import { SwapExecutionState } from "./SwapExecutionPage";
import { useAtomValue } from "jotai";

type UseSwapExecutionStateParams = {
  route?: RouteResponse;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: { status: string };
  signaturesRemaining: number;
};

export function useSwapExecutionState({
  route,
  overallStatus,
  isValidatingGasBalance,
  signaturesRemaining,
}: UseSwapExecutionStateParams): SwapExecutionState {
  const { userAddresses } = useAtomValue(swapExecutionStateAtom);

  return useMemo(() => {
    const destinationAddress = userAddresses[userAddresses.length - 1].address;

    const allAddressesSet = route?.requiredChainAddresses.every(
      (_chainId, index) => userAddresses[index]?.address,
    );

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

    if (isValidatingGasBalance && isValidatingGasBalance.status !== "completed") {
      return SwapExecutionState.validatingGasBalance;
    }

    if (overallStatus === "signing") {
      return SwapExecutionState.waitingForSigning;
    }

    if (!destinationAddress) {
      return SwapExecutionState.destinationAddressUnset;
    }

    if (!allAddressesSet) {
      return SwapExecutionState.recoveryAddressUnset;
    }

    return SwapExecutionState.ready;
  }, [
    userAddresses,
    route?.requiredChainAddresses,
    overallStatus,
    isValidatingGasBalance,
    signaturesRemaining,
  ]);
}
