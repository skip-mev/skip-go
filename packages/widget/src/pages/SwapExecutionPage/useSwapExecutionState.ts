import { useMemo } from "react";
import { ChainAddress } from "@/state/swapExecutionPage";
import { SwapExecutionState } from "./SwapExecutionPage";
import { currentTransactionAtom } from "@/state/history";
import { useAtomValue } from "jotai";
import { gasOnReceiveAtom } from "@/state/gasOnReceive";

type UseSwapExecutionStateParams = {
  chainAddresses: Record<number, ChainAddress>;
  gasRouteChainAddresses?: Record<number, ChainAddress>;
  requiredChainAddresses?: string[];
  gasRouteRequiredChainAddresses?: string[];
  isGettingAddressesLoading: boolean;
  isGettingGasRouteAddressesLoading?: boolean;
  isFetchingDestinationBalance: boolean;
};

export function useSwapExecutionState({
  chainAddresses,
  requiredChainAddresses,
  isGettingAddressesLoading,
  isFetchingDestinationBalance,
  gasRouteChainAddresses,
  gasRouteRequiredChainAddresses,
  isGettingGasRouteAddressesLoading: isGettingGasRouteAddressesLoading,
}: UseSwapExecutionStateParams): SwapExecutionState {
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const isGasRouteEnabled = useAtomValue(gasOnReceiveAtom);

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
    if (isGasRouteEnabled && isGettingGasRouteAddressesLoading)
      return SwapExecutionState.pendingGettingGasRouteAddresses;

    if (!chainAddresses) return SwapExecutionState.destinationAddressUnset;
    if (!requiredChainAddresses) return SwapExecutionState.destinationAddressUnset;

    const allAddressesSet = requiredChainAddresses.every(
      (_chainId, index) => chainAddresses[index]?.address,
    );

    const gasRouteAllAddressesSet = gasRouteRequiredChainAddresses?.every(
      (_chainId, index) => gasRouteChainAddresses?.[index]?.address,
    );

    const lastChainAddress = chainAddresses[requiredChainAddresses.length - 1]?.address;

    if (currentTransaction?.status === "failed") {
      return SwapExecutionState.pendingError;
    }

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

    if (isGasRouteEnabled && gasRouteRequiredChainAddresses && !gasRouteAllAddressesSet) {
      return SwapExecutionState.gasRouteRecoveryAddressUnset;
    }

    return SwapExecutionState.ready;
  }, [
    isFetchingDestinationBalance,
    isGettingAddressesLoading,
    isGasRouteEnabled,
    isGettingGasRouteAddressesLoading,
    chainAddresses,
    requiredChainAddresses,
    gasRouteRequiredChainAddresses,
    currentTransaction?.status,
    gasRouteChainAddresses,
    showSignaturesRemaining,
  ]);
}
