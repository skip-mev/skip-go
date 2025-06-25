import { useMemo } from "react";
import { ChainAddress } from "@/state/swapExecutionPage";
import { SwapExecutionState } from "./SwapExecutionPage";
import { RouteResponse } from "@skip-go/client";
import { currentTransactionAtom } from "@/state/history";
import { useAtomValue } from "jotai";

type UseSwapExecutionStateParams = {
  chainAddresses: Record<number, ChainAddress>;
  route?: RouteResponse;
  isLoading: boolean;
};

export function useSwapExecutionState({
  chainAddresses,
  route,
  isLoading,
}: UseSwapExecutionStateParams): SwapExecutionState {
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const signaturesRemaining =
    (currentTransaction?.txsRequired ?? 0) - (currentTransaction?.txsSigned ?? 0);
  return useMemo(() => {
    if (isLoading) return SwapExecutionState.pendingGettingAddresses;
    if (!chainAddresses) return SwapExecutionState.destinationAddressUnset;
    const requiredChainAddresses = route?.requiredChainAddresses;
    if (!requiredChainAddresses) return SwapExecutionState.destinationAddressUnset;

    const allAddressesSet = requiredChainAddresses.every(
      (_chainId, index) => chainAddresses[index]?.address,
    );

    const lastChainAddress = chainAddresses[requiredChainAddresses.length - 1]?.address;

    if (currentTransaction?.status === "completed") {
      return SwapExecutionState.confirmed;
    }

    if (currentTransaction?.status === "pending") {
      if (signaturesRemaining > 0) {
        return SwapExecutionState.signaturesRemaining;
      }
      return SwapExecutionState.pending;
    }

    if (currentTransaction?.status === "allowance") {
      return SwapExecutionState.approving;
    }

    if (currentTransaction?.status === "validating") {
      return SwapExecutionState.validatingGasBalance;
    }

    if (currentTransaction?.status === "signing") {
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
    isLoading,
    chainAddresses,
    route?.requiredChainAddresses,
    currentTransaction,
    signaturesRemaining,
  ]);
}
