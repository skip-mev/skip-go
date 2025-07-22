import { useMemo } from "react";
import { ChainAddress } from "@/state/swapExecutionPage";
import { SwapExecutionState } from "./SwapExecutionPage";
import { RouteResponse } from "@skip-go/client";
import { currentTransactionAtom } from "@/state/history";
import { useAtomValue } from "jotai";

type UseSwapExecutionStateParams = {
  chainAddresses: Record<number, ChainAddress>;
  route?: RouteResponse;
  isGettingAddressesLoading: boolean;
  isFetchingDestinationBalance: boolean;
};

export function useSwapExecutionState({
  chainAddresses,
  route,
  isGettingAddressesLoading,
  isFetchingDestinationBalance,
}: UseSwapExecutionStateParams): SwapExecutionState {
  const currentTransaction = useAtomValue(currentTransactionAtom);

  const showSignaturesRemaining = useMemo(() => {
    if (!currentTransaction) return false;
    if (
      currentTransaction?.txsRequired >= 2 &&
      currentTransaction?.txsSigned !== currentTransaction?.txsRequired
    ) {
      return true;
    }

    return false;
  }, [currentTransaction]);

  return useMemo(() => {
    if (isFetchingDestinationBalance) return SwapExecutionState.pendingGettingDestinationBalance;
    if (isGettingAddressesLoading) return SwapExecutionState.pendingGettingAddresses;
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
      return SwapExecutionState.pending;
    }

    if (currentTransaction?.status === "allowance") {
      return SwapExecutionState.approving;
    }

    if (currentTransaction?.status === "validating") {
      return SwapExecutionState.validatingGasBalance;
    }

    if (currentTransaction?.status === "signing") {
      if (showSignaturesRemaining) {
        return SwapExecutionState.signaturesRemaining;
      }
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
    isFetchingDestinationBalance,
    isGettingAddressesLoading,
    chainAddresses,
    route?.requiredChainAddresses,
    currentTransaction?.status,
    showSignaturesRemaining,
  ]);
}
